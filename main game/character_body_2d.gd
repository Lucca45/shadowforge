extends CharacterBody2D


const SPEED = 300.0
const JUMP_VELOCITY = -400.0
@onready var anim_sprite = $AnimatedSprite2D
@onready var static_sprite = $Sprite2D
var gems_collected = 0
var total_gems = 2

func _physics_process(delta: float) -> void:
	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Handle jump.
	if Input.is_action_just_pressed("ui_accept") and is_on_floor():
		velocity.y = JUMP_VELOCITY

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var direction := Input.get_axis("ui_left", "ui_right")
	if direction:
		velocity.x = direction * SPEED
		anim_sprite.visible = true
		static_sprite.visible = false
		anim_sprite.flip_h = direction < 0
		
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		anim_sprite.visible = false
		static_sprite.visible = true
		
	move_and_slide()
	
func collect_gem():
	gems_collected += 1
	print("Gems collected: ", gems_collected)
	
func _on_body_entered(body: Node) -> void:
	print("player touched by:", body)  
	
