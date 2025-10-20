extends Control

# 0 = leeg, 1 = X, 2 = O
var board := PackedInt32Array([0,0,0,0,0,0,0,0,0])
@export var vs_ai: bool = false
var current_player: int = 1

# Alle mogelijke winstcombinaties
const WINS = [
	[0,1,2],[3,4,5],[6,7,8],
	[0,3,6],[1,4,7],[2,5,8],
	[0,4,8],[2,4,6]
]

@onready var grid: GridContainer = $Grid
@onready var status_label: Label = $StatusLabel
@onready var restart_button: Button = $RestartButton
var cell_buttons: Array[Button] = []

func _ready() -> void:
	_create_grid_buttons()
	restart_button.pressed.connect(_on_restart_pressed)
	_update_status()

func _create_grid_buttons() -> void:
	cell_buttons.clear()
	
	# verwijder bestaande kinderen (GridContainer heeft geen clear() meer)
	for child in grid.get_children():
		grid.remove_child(child)
		child.queue_free()
	
	# voeg nieuwe knoppen toe
	for i in range(9):
		var b := Button.new()
		b.text = ""
		b.focus_mode = Control.FOCUS_NONE
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.size_flags_vertical = Control.SIZE_EXPAND_FILL
		b.pressed.connect(_on_cell_pressed.bind(i))
		grid.add_child(b)
		cell_buttons.append(b)

func _on_cell_pressed(index: int) -> void:
	if board[index] != 0 or _game_over():
		return
	board[index] = current_player
	_draw_board()

	var winner := _check_winner()
	if winner != 0:
		_game_end(winner)
		return
	elif _is_board_full():
		_game_end(0)
		return

	current_player = 3 - current_player
	_update_status()

	if vs_ai and current_player == 2:
		call_deferred("_ai_turn")

func _ai_turn() -> void:
	var move := _find_winning_move(2)
	if move == -1:
		move = _find_winning_move(1)
	if move == -1:
		var empties := []
		for i in range(9):
			if board[i] == 0:
				empties.append(i)
		if empties.size() > 0:
			move = empties[randi() % empties.size()]

	if move != -1:
		board[move] = 2
		_draw_board()
		var winner := _check_winner()
		if winner != 0:
			_game_end(winner)
			return
		elif _is_board_full():
			_game_end(0)
			return
		current_player = 1
		_update_status()

func _find_winning_move(player: int) -> int:
	for combo in WINS:
		var vals := [board[combo[0]], board[combo[1]], board[combo[2]]]
		if vals.count(player) == 2 and vals.count(0) == 1:
			for idx in combo:
				if board[idx] == 0:
					return idx
	return -1

func _draw_board() -> void:
	for i in range(9):
		var b := cell_buttons[i]
		match board[i]:
			0:
				b.text = ""
				b.disabled = false
			1:
				b.text = "X"
				b.disabled = true
			2:
				b.text = "O"
				b.disabled = true

func _check_winner() -> int:
	for combo in WINS:
		var a: int = combo[0]
		var b: int = combo[1]
		var c: int = combo[2]
		if board[a] != 0 and board[a] == board[b] and board[b] == board[c]:
			return board[a]
	return 0

func _is_board_full() -> bool:
	for v in board:
		if v == 0:
			return false
	return true

func _game_end(winner: int) -> void:
	match winner:
		0:
			status_label.text = "Gelijkspel!"
		1:
			status_label.text = "Speler X wint!"
		2:
			status_label.text = "Speler O wint!"
	for b in cell_buttons:
		b.disabled = true

func _game_over() -> bool:
	return _check_winner() != 0 or _is_board_full()

func _update_status() -> void:
	if _game_over():
		var w := _check_winner()
		if w == 0:
			status_label.text = "Gelijkspel!"
		elif w == 1:
			status_label.text = "Speler X heeft gewonnen!"
		else:
			status_label.text = "Speler O heeft gewonnen!"
	else:
		status_label.text = "Beurt: %s" % ("X" if current_player == 1 else "O")

func _on_restart_pressed() -> void:
	_reset_game()

func _reset_game() -> void:
	for i in range(9):
		board[i] = 0
	current_player = 1
	_draw_board()
	_update_status()
