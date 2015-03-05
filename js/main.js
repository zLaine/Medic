window.onload = function() 
{
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    "use strict";
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    const var TIMER = 30;
    const var SAVED_BONUS = 5;
    
    var bandage;
    var body;
    var blood;
    var background;
    var timeleft = TIMER;
    var peopleSaved = 0;
    var injuries;
    
    var reunited;
    var x;
    var y;
    
    function preload() 
    {
        game.load.image('blood', 'assets/blood.png');
        game.load.image('bandage', 'assets/bandage.png');
        game.load.image('body', 'assets/body.png');
        game.load.image('BG', 'assets/medicBG.png');
        
        game.load.audio('reunited', 'assets/Reunited1.mp3');
    }
    
    
    function create() 
    {
        game.world.setBounds(0, 0, 800, 600);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.sprite(0,0, 'BG');
        
        //playing music
        reunited = game.add.audio('reunited');
        reunited.loop = true;
        reunited.play();
        
        injuries = game.add.group();
        game.physics.arcade.enable(people);
        injuries.enableBody = true;
        injuries.physicsBodyType = Phaser.Physics.ARCADE;
    //    people.body.allowRotation = false;
    //    people.body.collideWorldBounds = true;
        // allows mouse clicks
    //    background.events.onInputDown.add(arrowRelease, this);
        
        for (var i = 0; i < 20; i++)
        {
            var injury = injuries.create(game.rnd.integerInRange(100, 770), game.rnd.integerInRange(0, 570), 'blood');
            injury.name = 'injury' + i;
            injury.body.immovable = true;
            injury.inputEnabled = true;
            //c.scale.set(2);
            
            injury.events.onInputDown.add(arrowRelease, this);
        }


       game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
    }
    
    function update() 
    {
        game.physics.arcade.collide(arrow, people, collisionHandler, null, this);
        
     }
     
     
     function arrowRelease(target)
     {
        arrow = game.add.sprite(game.world.centerX, game.world.centerY, 'arrow');
        game.physics.arcade.enable(arrow);
        arrow.enableBody = true;
        arrow.physicsBodyType = Phaser.Physics.ARCADE;
        arrow.body.allowRotation = false; 
        arrow.scale.set(.9);
        
        x = game.input.mousePointer.x;
        y = game.input.mousePointer.y;
        arrow.rotation = game.physics.arcade.moveToXY(arrow, x, y, 120);
        arrow.rotation = game.physics.arcade.angleBetween(arrow, target);
        
        arrShoot = game.add.tween(arrow.scale);
        arrShoot.to({x: .25, y: .25}, 1000);
        arrShoot.start();
     }
     
     function collisionHandler (arrow, people) 
    {
        if(people.frame == 12 || people.frame == 13 || people.frame == 14)
        {
            cats++;
            counter++;
        }
        else
        {
            humans++;
            counter++;
        }
        if(counter%2 == 0)
        {
            if(cats == 2)
            {
                kittens++;
                cats = 0;
            }
            else if(humans == 2)
            {
                couples++;
                humans = 0;
            }
            else if(cats == 1 && humans ==1)
            {
                catPeople++;
                cats = 0;
                humans = 0;
            }
        }
        people.kill();
        arrow.kill();
    }
     
};
