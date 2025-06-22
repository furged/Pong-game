import turtle #basic graphics library (built-in)

window = turtle.Screen()
window.title("Pong by Furged") #title ofc
window.bgcolor("black") #background color of window we wannna make
window.setup(width=800, height=600)  #size of window
window.tracer(0) #will stop the window from updating so we can manually do it now
#this will speed up our game quite a bit.. otherwisw the game will be slow

#LEFT ABND RIGHT PADDLES

#paddle A
paddle_a = turtle.Turtle()# turle = module name, Turtle = class name
paddle_a.speed(0) # does not mean the speed of paddle but the speed of animation and this sets the speed to max
paddle_a.shape("square") # there are a few builtin shapes and this is one of those and it is 20px by 20 px
paddle_a.color("white") 
paddle_a.shapesize(stretch_wid=5, stretch_len=1)
paddle_a.penup() # movement is up and down
paddle_a.goto(-350, 0) 

#paddle B
paddle_b = turtle.Turtle()
paddle_b.speed(0)
paddle_b.shape("square")
paddle_b.color("white")
paddle_b.shapesize(stretch_wid=5, stretch_len=1)
paddle_b.penup()
paddle_b.goto(350, 0)

#ball
ball = turtle.Turtle()
ball.speed(0)
ball.shape("square")
ball.color("white")
ball.penup()
ball.goto(0, 0)

#now we will write funtions to move those paddles and ball
def paddle_a_up():
   
    y = paddle_a.ycor() #turtle library method.. returns the y cordinate of turtle
    y += 20 #adds 20px to y.. if it will go up means y is increasing
    paddle_a.sety(y) #gonna set y to new y

def paddle_a_down():
    y = paddle_a.ycor()
    y -= 20
    paddle_a.sety(y)

def paddle_b_up():
    y = paddle_b.ycor()
    y += 20
    paddle_b.sety(y)

def paddle_b_down():
    y = paddle_b.ycor()
    y -= 20
    paddle_b.sety(y)

#keyboard binding
window.listen() #tells window to listen for the keyboard input
window.onkeypress(paddle_a_up, "w")
window.onkeypress(paddle_a_down, "s")
window.onkeypress(paddle_b_up, "Up")
window.onkeypress(paddle_b_down, "Down")

#now, every game needs a MAIN GAME LOOP
while True:
    window.update()