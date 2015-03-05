window.onload = function() 
{
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    "use strict";
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );

    var TIMER_START = 30;
    var SAVED_BONUS = 5;
    var INJURY_RANGE_MIN = 333;
    var INJURY_RANGE_MAX = 468;
    
    var body;
    var background;
    var bgm;
    
    var timer;
    var timeLeft = TIMER_START;
    var peopleSaved = 0;
    var injuries;
    var bandages;
    var numInjuries;
    var injuriesLeft;
    
    var style;
    var timeText;
    var savedText;
    
    var x;
    var y;
    
    function preload() 
    {
        game.load.image('blood', 'assets/blood.png');
        game.load.image('bandage', 'assets/bandage.png');
        game.load.image('body', 'assets/body.png');
        game.load.image('BG', 'assets/medicBG.png');
        
        game.load.audio('bgm', 'assets/Reunited.mp3');
    }
    
    
    function create() 
    {
        game.world.setBounds(0, 0, 800, 600);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.sprite(0,0, 'BG');
        body = game.add.sprite(303, 50, 'body');
        
        //playing music
        bgm = game.add.audio('bgm');
        bgm.loop = true;
   //     bgm.play();
   
        //text set up
        style = { font: "20px Times New Roman", fill: "#000000", align: "left" };
        timeText = game.add.text(718, 60, '' + timeLeft, style);
        savedText = game.add.text(752, 183, '' + peopleSaved, style);
   
        game.physics.arcade.enable(body);
        body.enableBody = true;
        body.physicsBodyType = Phaser.Physics.ARCADE;
        body.body.immoveable = true;
        body.inputEnabled = true;
        
        injuries = game.add.group();
        game.physics.arcade.enable(injuries);
        injuries.enableBody = true;
        injuries.physicsBodyType = Phaser.Physics.ARCADE;
        
        bandages = game.add.group();
        game.physics.arcade.enable(bandages);
        bandages.enableBody = true;
        bandages.physicsBodyType = Phaser.Physics.ARCADE;
        // allows mouse clicks
    //    background.events.onInputDown.add(arrowRelease, this);
        
        newPerson();
    
        timer = game.time.events.add(Math.floor(Phaser.Timer.SECOND * TIMER_START/1000), gameOver, this);

       game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
    }
    
    function update() 
    {
        timeLeft = game.time.events.duration/1000;
        timeText.text = '' + timeLeft;
    //    if(ov)
        game.physics.arcade.collide(injuries, bandages, collisionHandler, null, this);
        if(numInjuries = 0)
        {
            newPerson();
        }
        
    }
    function gameOver()
    {
        
    }
     
     function newPerson()
     {
        numInjuries = game.rnd.integerInRange(1, 5);
        injuriesLeft = numInjuries;
        
         for (var i = 1; i < numInjuries; i++)
        {
            var injury = injuries.create(game.rnd.integerInRange(INJURY_RANGE_MIN, INJURY_RANGE_MAX), game.rnd.integerInRange(50, 595), 'blood');
            x = injury.x;
            y = injury.y;
            //makes sure injuries show up on the body and not between the legs etc
            while((injury.x > 378 && injury.x < 426 && injury.y > 435))
            {
                injury.x = game.rnd.integerInRange(INJURY_RANGE_MIN, INJURY_RANGE_MAX);
                injury.y = game.rnd.integerInRange(50, 595);
            }
            
            injury.name = 'injury' + i;
            injury.body.immovable = true;
            injury.inputEnabled = true;
            injury.scale.set(.5);
            
            var bandage = bandages.create(50, 50, 'bandage');
            bandage.name = 'bandage' + i;
            bandage.body.immovable = false;
            bandage.inputEnabled = true;
            bandage.input.enableDrag(false, true);
            bandage.scale.set(.5);
            
        //    injury.events.onInputDown.add(arrowRelease, this);
        }
     }
     
 /*    function arrowRelease()
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
     } */
     
     function collisionHandler (injury, bandage) 
    {
        peopleSaved += 1;
        injuriesLeft -= 1;
        
        injury.kill();
        bandage.kill();
        
        if(injuriesLeft <= 0)
        {
            newPerson();
        }
    }
    
    function render() 
    {
        game.debug.inputInfo(32, 32);
    }
};
