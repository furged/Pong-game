import turtle #basic graphics library (built-in)

window = turtle.Screen()
window.title("Pong by Furged") #title ofc
window.bgcolor("black") #background color of window we wannna make
window.setup(width=800, height=600)  #size of window
window.tracer(0) #will stop the window from updating so we can manually do it now
#this will speed up our game quite a bit.. otherwisw the game will be slow

# Score
score_a = 0
score_b = 0


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
#the movement will be seperated into x and y 
ball = turtle.Turtle()
ball.speed(0)
ball.shape("square")
ball.color("white")
ball.penup()
ball.goto(0, 0)
ball.dx = 2 #d in dx means delta or change (speed of x) it means that the ball will move by 2 pxls everytime it moves
ball.dy = 2

# pen (also a turtle for us)
pen = turtle.Turtle()
pen.speed(0)
pen.color("white")
pen.penup() #cus we dont wanna draw a line when the pen moves
pen.hideturtle()
pen.goto(0, 260)
pen.write(f"Player A: {score_a} Player B: {score_b}", align = "center", font = ("Courier", 20, "normal"))

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
def game_loop():
    global score_a, score_b

    window.update()
    #now obviously to get the ball keep moving we need to put it in loop
    ball.setx(ball.xcor() + ball.dx)
    ball.sety(ball.ycor() + ball.dy)

    #border checking
    #top border (we need to compare the balls y coordinate)
    if ball.ycor() > 290: #we took 290 bcs ball itself is 20 px and we will subtract 10 from top and 10 from the bottom hence 300 - 10
        ball.sety(290)
        ball.dy *= -1

    if ball.ycor() < -290: #we took 290 bcs ball itself is 20 px and we will subtract 10 from top and 10 from the bottom hence 300 - 10
        ball.sety(-290)
        ball.dy *= -1 

    if ball.xcor() > 390:
        ball.goto(0, 0)
        ball.dx *= -1
        score_a += 1
        pen.clear()
        pen.write(f"Player A: {score_a} Player B: {score_b}", align = "center", font = ("Courier", 20, "normal"))

    if ball.xcor() < -390:
        ball.goto(0, 0)
        ball.dx *= -1
        score_b += 1
        pen.clear()
        pen.write(f"Player A: {score_a} Player B: {score_b}", align = "center", font = ("Courier", 20, "normal"))


    # Paddle and ball collision    
    if (ball.xcor() > 340 and ball.xcor() <350 and (ball.ycor() < paddle_b.ycor() + 40 and ball.ycor() > paddle_b.ycor() - 40)):
        ball.setx(340)
        ball.dx *= -1

    if (ball.xcor() < -340 and ball.xcor() > -350 and (ball.ycor() < paddle_a.ycor() + 40 and ball.ycor() > paddle_a.ycor() - 40)):
        ball.setx(-340)
        ball.dx *= -1

    window.ontimer(game_loop, 10)

game_loop()
window.mainloop()