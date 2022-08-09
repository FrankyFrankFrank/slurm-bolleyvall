import Matter from "matter-js";

var Example = Example || {};

Example.compound = function() {
    const FLOOR_HEIGHT = 20
    const NET_HEIGHT = 30
    const NET_WIDTH = 5
    const SLIME_HEIGHT = 25
    const SLIME_WIDTH = SLIME_HEIGHT * 2

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showStats: true,
            showPerformance: true,
            wireframes: false,
        }
    });


    engine.gravity.scale = 0.0001;
    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // create bodies

    // create floor
    const floor = Bodies.rectangle(
      render.canvas.width / 2, render.canvas.height - FLOOR_HEIGHT / 2, render.canvas.width, FLOOR_HEIGHT, {
        render: {
          fillStyle: 'beige'
        },
        isStatic: true
      }
    )
    
    // create net
    const net = Bodies.rectangle(
        render.canvas.width / 2, render.canvas.height - FLOOR_HEIGHT - NET_HEIGHT / 2, NET_WIDTH, NET_HEIGHT, {
            render: {
                fillStyle: 'white'
            },
            isStatic: true
        }
    )

    // create left Slime
    const leftSlime = Bodies.rectangle(
        render.canvas.width / 4, render.canvas.height - FLOOR_HEIGHT - SLIME_HEIGHT / 2, SLIME_WIDTH, SLIME_HEIGHT, {
            render: {
                fillStyle: 'lime'
            },
        }
    )

    // create right Slime
    const rightSlime = Bodies.rectangle(
        render.canvas.width * 0.75, render.canvas.height - FLOOR_HEIGHT - SLIME_HEIGHT / 2, SLIME_WIDTH, SLIME_HEIGHT, {
            render: {
                fillStyle: 'red'
            },
        }
    )
    document.body.addEventListener('keydown', (k) => {
        const MOVE_SPEED = 0.007;
        if (k.keyCode == 65) {
            Body.applyForce(leftSlime, leftSlime.position, { x: -MOVE_SPEED, y: 0 });
            //Body.setPosition(leftSlime, {x: leftSlime.position.x - MOVE_SPEED, y: leftSlime.position.y})
        }
        if (k.keyCode == 68) {
            Body.applyForce(leftSlime, leftSlime.position, { x: MOVE_SPEED, y: 0 });
            //Body.setPosition(leftSlime, {x: leftSlime.position.x + MOVE_SPEED, y: leftSlime.position.y})
        }

        //if x < 0 || x > player netside  { set them back }
    })

    const ball = Bodies.circle(
        render.canvas.width / 4, render.canvas.height - SLIME_HEIGHT * 4, 5, {
            render: {
                fillStyle: 'red'
            },
            restitution: 1
        }
    )

    // add bodies to world
    Composite.add(world, [
        floor,
        net, 
        leftSlime,
        rightSlime,
        ball
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.compound.title = 'Compound Bodies';
Example.compound.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.compound;
}

Example.compound()