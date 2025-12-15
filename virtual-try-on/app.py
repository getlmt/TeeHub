
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from rembg import remove
from PIL import Image
import io
import time
import threading
import requests  # <--- QUAN TRỌNG: Cần import thư viện này

app = Flask(__name__)
CORS(app)

# MediaPipe setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=0,
    enable_segmentation=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

POSE_LANDMARKS = {
    'left_shoulder': 11, 'right_shoulder': 12,
    'left_elbow': 13, 'right_elbow': 14,
    'left_wrist': 15, 'right_wrist': 16,
    'left_hip': 23, 'right_hip': 24
}


class VirtualTryOn:
    def __init__(self, cloth_path):
        self.debug_mode = False
        self.show_shoulder_match = False
        self.prev_keypoints = None
        self.alpha_smooth = 0.8
        self.cloth_scale_factor = 0.6
        self.cloth_resolution = 800
        self.enable_sharpening = False
        self.sharpening_strength = 1.5
        self.target_fps = 13

        self.last_warped_cloth = None
        self.last_dst_points = None
        self.frame_skip = 0
        self.skip_interval = 1
        self.last_process_time = 0

        print("⏳ Đang khởi tạo và xử lý áo...")
        # Gọi hàm preprocess_cloth (Hàm này phải nằm trong class)
        self.cloth_rgba, self.src_points, self.cloth_shoulder_points = self.preprocess_cloth(cloth_path)
        self.cloth_h, self.cloth_w = self.cloth_rgba.shape[:2]
        print(f"✅ Đã load áo. Kích thước: {self.cloth_w}x{self.cloth_h}")

    def crop_to_content(self, img_rgba):
        alpha = img_rgba[:, :, 3]
        coords = cv2.findNonZero(alpha)
        if coords is None:
            return img_rgba, 0, 0
        x, y, w, h = cv2.boundingRect(coords)
        cropped = img_rgba[y:y + h, x:x + w]
        return cropped, x, y

    def detect_cloth_shoulders(self, cloth_rgba):
        h, w = cloth_rgba.shape[:2]
        alpha = cloth_rgba[:, :, 3]
        shoulder_region_height = int(h * 0.20)
        shoulder_region = alpha[:shoulder_region_height, :]
        center_x = w // 2

        left_shoulder_x = None
        left_shoulder_y = None
        for x in range(int(w * 0.35), int(w * 0.20), -1):
            col = shoulder_region[:, x]
            nonzero_rows = np.where(col > 128)[0]
            if len(nonzero_rows) > 3:
                left_shoulder_x = x
                left_shoulder_y = int(np.mean(nonzero_rows))
                break

        if left_shoulder_x is None:
            for x in range(int(w * 0.40), int(w * 0.10), -1):
                col = shoulder_region[:, x]
                nonzero_rows = np.where(col > 128)[0]
                if len(nonzero_rows) > 3:
                    left_shoulder_x = x
                    left_shoulder_y = int(np.mean(nonzero_rows))
                    break

        right_shoulder_x = None
        right_shoulder_y = None
        for x in range(int(w * 0.65), int(w * 0.80)):
            col = shoulder_region[:, x]
            nonzero_rows = np.where(col > 128)[0]
            if len(nonzero_rows) > 3:
                right_shoulder_x = x
                right_shoulder_y = int(np.mean(nonzero_rows))
                break

        if right_shoulder_x is None:
            for x in range(int(w * 0.60), int(w * 0.90)):
                col = shoulder_region[:, x]
                nonzero_rows = np.where(col > 128)[0]
                if len(nonzero_rows) > 3:
                    right_shoulder_x = x
                    right_shoulder_y = int(np.mean(nonzero_rows))
                    break

        if left_shoulder_x is None or right_shoulder_x is None:
            shoulder_width = w * 0.80
            left_shoulder_x = center_x - shoulder_width / 2
            right_shoulder_x = center_x + shoulder_width / 2
            left_shoulder_y = h * 0.15
            right_shoulder_y = h * 0.15

        return np.array([
            [left_shoulder_x, left_shoulder_y],
            [right_shoulder_x, right_shoulder_y]
        ], dtype=np.float32)

    # === ĐÂY LÀ HÀM BẠN ĐANG THIẾU HOẶC BỊ LỖI ===
    def preprocess_cloth(self, cloth_path):
        # 1. Load ảnh từ URL hoặc File local
        try:
            if cloth_path.startswith(('http://', 'https://')):
                print(f"🌐 Đang tải ảnh từ URL: {cloth_path}")
                # Giả lập User-Agent để tránh bị chặn bởi một số server ảnh
                headers = {'User-Agent': 'Mozilla/5.0'}
                response = requests.get(cloth_path, headers=headers, stream=True, timeout=10)
                response.raise_for_status()
                cloth_pil = Image.open(io.BytesIO(response.content))
            else:
                cloth_pil = Image.open(cloth_path)
        except Exception as e:
            print(f"❌ Lỗi không tải được ảnh: {e}")
            raise e

        # 2. Xử lý convert RGBA
        if cloth_pil.mode != 'RGBA':
            cloth_pil = cloth_pil.convert('RGBA')

        if max(cloth_pil.size) > 2048:
            cloth_pil.thumbnail((2048, 2048), Image.LANCZOS)

        # 3. Remove background
        img_byte_arr = io.BytesIO()
        cloth_pil.save(img_byte_arr, format='PNG')
        input_bytes = img_byte_arr.getvalue()
        output_bytes = remove(input_bytes)
        cloth_rgba_pil = Image.open(io.BytesIO(output_bytes))

        # Convert PIL -> Numpy
        cloth_rgba = np.array(cloth_rgba_pil)

        # === FIX LỖI MÀU: RGB -> BGR ===
        # OpenCV dùng BGR, còn PIL dùng RGB. Cần convert hệ màu.
        try:
            cloth_rgba = cv2.cvtColor(cloth_rgba, cv2.COLOR_RGBA2BGRA)
        except Exception as e:
            # Phòng trường hợp ảnh lỗi không convert được thì giữ nguyên
            print(f"⚠️ Cảnh báo màu sắc: {e}")
        # ===============================

        cloth_rgba, offset_x, offset_y = self.crop_to_content(cloth_rgba)

        h, w = cloth_rgba.shape[:2]
        target_w = self.cloth_resolution
        if w > 0:
            scale = target_w / w
        else:
            scale = 1
        target_h = int(h * scale)

        cloth_rgba = cv2.resize(cloth_rgba, (target_w, target_h), interpolation=cv2.INTER_LINEAR)

        h, w = cloth_rgba.shape[:2]
        shoulder_points = self.detect_cloth_shoulders(cloth_rgba)
        shoulder_width = shoulder_points[1][0] - shoulder_points[0][0]
        center_x = w // 2

        elbow_ratio = 0.90
        hip_ratio = 0.95
        elbow_width = shoulder_width * elbow_ratio / 2
        hip_width = shoulder_width * hip_ratio / 2

        src_points = np.array([
            shoulder_points[0],
            shoulder_points[1],
            [center_x - elbow_width, h * 0.45],
            [center_x + elbow_width, h * 0.45],
            [center_x - hip_width, h * 0.90],
            [center_x + hip_width, h * 0.90]
        ], dtype=np.float32)

        return cloth_rgba, src_points, shoulder_points
    # ===============================================

    def get_body_keypoints(self, image_rgb, h, w):
        results = pose.process(image_rgb)
        if not results.pose_landmarks:
            return None, None, None

        landmarks = results.pose_landmarks.landmark

        def get_pt(name):
            lm = landmarks[POSE_LANDMARKS[name]]
            return [lm.x * w, lm.y * h]

        l_shoulder = np.array(get_pt('left_shoulder'))
        r_shoulder = np.array(get_pt('right_shoulder'))
        l_elbow = np.array(get_pt('left_elbow'))
        r_elbow = np.array(get_pt('right_elbow'))
        l_hip = np.array(get_pt('left_hip'))
        r_hip = np.array(get_pt('right_hip'))

        cloth_shoulder_width = self.cloth_shoulder_points[1][0] - self.cloth_shoulder_points[0][0]
        cloth_height = self.cloth_h
        cloth_aspect_ratio = cloth_height / cloth_shoulder_width

        shoulder_vec = r_shoulder - l_shoulder
        shoulder_center = (l_shoulder + r_shoulder) / 2
        body_shoulder_width = np.linalg.norm(shoulder_vec)

        target_shoulder_width = body_shoulder_width * self.cloth_scale_factor
        scaled_shoulder_vec = shoulder_vec * self.cloth_scale_factor
        l_shoulder_scaled = shoulder_center - scaled_shoulder_vec / 2
        r_shoulder_scaled = shoulder_center + scaled_shoulder_vec / 2

        target_cloth_height = target_shoulder_width * cloth_aspect_ratio

        body_torso_vec = ((l_hip + r_hip) / 2) - shoulder_center
        body_torso_length = np.linalg.norm(body_torso_vec)
        body_torso_direction = body_torso_vec / body_torso_length

        hip_center_target = shoulder_center + body_torso_direction * target_cloth_height * 0.85

        cloth_hip_width = self.src_points[5][0] - self.src_points[4][0]
        hip_to_shoulder_ratio = cloth_hip_width / cloth_shoulder_width
        target_hip_width = target_shoulder_width * hip_to_shoulder_ratio

        hip_direction = np.array([-body_torso_direction[1], body_torso_direction[0]])
        l_hip_final = hip_center_target - hip_direction * target_hip_width / 2
        r_hip_final = hip_center_target + hip_direction * target_hip_width / 2

        cloth_elbow_width = self.src_points[3][0] - self.src_points[2][0]
        elbow_to_shoulder_ratio = cloth_elbow_width / cloth_shoulder_width
        target_elbow_width = target_shoulder_width * elbow_to_shoulder_ratio

        elbow_height_ratio = (self.src_points[2][1] - self.src_points[0][1]) / cloth_height
        elbow_center = shoulder_center + body_torso_direction * target_cloth_height * elbow_height_ratio

        l_elbow_final = elbow_center - hip_direction * target_elbow_width / 2
        r_elbow_final = elbow_center + hip_direction * target_elbow_width / 2

        dst_points = np.array([
            l_shoulder_scaled, r_shoulder_scaled,
            l_elbow_final, r_elbow_final,
            l_hip_final, r_hip_final
        ], dtype=np.float32)

        if self.prev_keypoints is None:
            self.prev_keypoints = dst_points
        else:
            dst_points = self.alpha_smooth * self.prev_keypoints + (1 - self.alpha_smooth) * dst_points
            self.prev_keypoints = dst_points

        shoulder_dst = np.array([l_shoulder_scaled, r_shoulder_scaled], dtype=np.float32)

        return dst_points, shoulder_dst, results

    def warp_cloth(self, dst_points, frame_shape):
        h_frame, w_frame = frame_shape[:2]

        if self.last_dst_points is not None:
            diff = np.linalg.norm(dst_points - self.last_dst_points)
            if diff < 5:
                if self.last_warped_cloth is not None:
                    return self.last_warped_cloth

        src_rect = np.array([self.src_points[0], self.src_points[1],
                             self.src_points[5], self.src_points[4]], dtype=np.float32)
        dst_rect = np.array([dst_points[0], dst_points[1],
                             dst_points[5], dst_points[4]], dtype=np.float32)

        M, status = cv2.findHomography(src_rect, dst_rect, cv2.RANSAC, 5.0)
        if M is None:
            return np.zeros((h_frame, w_frame, 4), dtype=np.uint8)

        warped_cloth = cv2.warpPerspective(
            self.cloth_rgba, M, (w_frame, h_frame),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0, 0)
        )

        self.last_warped_cloth = warped_cloth
        self.last_dst_points = dst_points.copy()

        return warped_cloth

    def overlay_image(self, background, foreground):
        alpha = foreground[:, :, 3] / 255.0
        if np.sum(alpha) == 0:
            return background
        alpha_3 = np.dstack((alpha, alpha, alpha))
        composite = background * (1.0 - alpha_3) + foreground[:, :, :3] * alpha_3
        return composite.astype(np.uint8)

    def process(self, frame):
        h, w = frame.shape[:2]
        scale_factor = 0.75
        small_h, small_w = int(h * scale_factor), int(w * scale_factor)
        small_frame = cv2.resize(frame, (small_w, small_h), interpolation=cv2.INTER_LINEAR)

        frame_rgb = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        dst_points, shoulder_dst, pose_results = self.get_body_keypoints(frame_rgb, small_h, small_w)

        if dst_points is not None:
            dst_points_scaled = dst_points / scale_factor
            warped_cloth = self.warp_cloth(dst_points_scaled, frame.shape)
            result = self.overlay_image(frame, warped_cloth)
        else:
            result = frame

        return result


# Global variables
try_on_app = None
camera = None
camera_lock = threading.Lock()
is_streaming = False


def get_camera():
    """Khởi tạo camera một lần duy nhất"""
    global camera
    if camera is None:
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        camera.set(cv2.CAP_PROP_FPS, 30)
    return camera


def generate_frames():
    """Generator function để stream video"""
    global try_on_app, is_streaming

    cam = get_camera()

    while is_streaming:
        with camera_lock:
            success, frame = cam.read()

        if not success:
            break

        # Xử lý frame nếu đã khởi tạo try-on
        if try_on_app is not None:
            frame = try_on_app.process(frame)

        # Encode frame thành JPEG
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 75]
        ret, buffer = cv2.imencode('.jpg', frame, encode_param)

        if not ret:
            continue

        # Chuyển thành bytes và yield
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Giới hạn FPS
        time.sleep(1 / 30)


@app.route('/init', methods=['POST'])
def init_tryon():
    """Khởi tạo virtual try-on với đường dẫn áo"""
    global try_on_app
    try:
        data = request.json
        cloth_path = data.get('cloth_path', 'ao3.png')

        print(f"📦 Đang load áo từ: {cloth_path}")
        try_on_app = VirtualTryOn(cloth_path)

        return jsonify({
            'status': 'success',
            'message': f'Đã khởi tạo thành công với áo: {cloth_path}'
        })
    except Exception as e:
        print(f"❌ Lỗi khởi tạo: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/start_stream', methods=['POST'])
def start_stream():
    """Bắt đầu streaming"""
    global is_streaming

    if try_on_app is None:
        return jsonify({
            'status': 'error',
            'message': 'Chưa khởi tạo. Vui lòng gọi /init trước'
        }), 400

    is_streaming = True
    return jsonify({'status': 'success', 'message': 'Đã bắt đầu streaming'})


@app.route('/stop_stream', methods=['POST'])
def stop_stream():
    """Dừng streaming"""
    global is_streaming
    is_streaming = False
    return jsonify({'status': 'success', 'message': 'Đã dừng streaming'})


@app.route('/video_feed')
def video_feed():
    """Route để stream video"""
    if not is_streaming:
        return jsonify({'status': 'error', 'message': 'Chưa bắt đầu streaming'}), 400

    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


@app.route('/update_settings', methods=['POST'])
def update_settings():
    """Cập nhật settings"""
    global try_on_app
    if try_on_app is None:
        return jsonify({'status': 'error', 'message': 'Chưa khởi tạo'}), 400

    data = request.json
    if 'scale' in data:
        try_on_app.cloth_scale_factor = float(data['scale'])
        try_on_app.prev_keypoints = None
    if 'sharpening' in data:
        try_on_app.sharpening_strength = float(data['sharpening'])

    return jsonify({'status': 'success'})


@app.route('/status', methods=['GET'])
def get_status():
    """Kiểm tra trạng thái"""
    return jsonify({
        'initialized': try_on_app is not None,
        'streaming': is_streaming,
        'camera_available': camera is not None
    })


if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print("📹 Camera sẽ được khởi động khi bắt đầu streaming")
    app.run(debug=True, port=5000, threaded=True)