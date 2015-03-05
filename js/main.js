window.onload = function() 
{
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    "use strict";
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    var TIMER = 30;
    var SAVED_BONUS = 5;
    
   // var bandage;
    var body;
 //   var blood;
    var background;
    var bgm;
    var timeleft = TIMER;
    var peopleSaved = 0;
    var injuries;
    var bandages;
    var numInjuries;
    var injuriesLeft;
    
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
   
        body.physics.arcade.enable(body);
        body.enableBody = true;
        body.physicsBodyType = Phaser.Physics.ARCADE;
        body.body.immoveable = true;
        body.inputEnabled = true;
        
        injuries = game.add.group();
        game.physics.arcade.enable(injuries);
        injuries.enableBody = true;
        injuries.physicsBodyType = Phaser.Physics.ARCADE;
        injuries.body.immovable = true;
        injuries.inputEnabled = true;
        injuries.scale.set(.5);
        
        bandages = game.add.group();
        game.physics.arcade.enable(bandages);
        bandages.enableBody = true;
        bandages.physicsBodyType = Phaser.Physics.ARCADE;
        bandages.body.immovable = false;
        bandages.inputEnabled = true;
        bandages.input.enableDrag(false, true);
        bandages.scale.set(.5);
        // allows mouse clicks
    //    background.events.onInputDown.add(arrowRelease, this);
        
        newPerson();


       game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
    }
    
    function update() 
    {
        if(!game.physics.arcade.collide(injuries, body))
        {
            newPerson();
        }
        game.physics.arcade.collide(injuries, bandages, collisionHandler, null, this);
        
    }
     
     function newPerson()
     {
        numInjuries = game.rnd.integerInRange(1, 5);
        injuriesLeft = numInjuries;
        
         for (var i = 1; i < numInjuries; i++)
        {
            var injury = injuries.create(game.rnd.integerInRange(333, 468), game.rnd.integerInRange(50, 595), 'blood');
            injury.name = 'injury' + i;
            
            var bandage = bandages.create(50, 50, 'bandage');
            bandage.name = 'bandage' + i;
            
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
     
};
