extends Spatial

func init_cam_pos() -> Transform:
	return $Camera.global_transform
