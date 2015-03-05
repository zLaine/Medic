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
    var injuryArr = [];
    var bandageArr = [];
    
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
        timeText = game.add.text(718, 60, '' + TIMER_START, style);
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
    
        timer = game.time.events.add(Phaser.Timer.SECOND * TIMER_START, gameOver, this);

       game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    }
    
    function update() 
    {
        timeLeft = game.time.events.duration/1000;
        timeText.text = '' + timeLeft;
        
        if(bandageArr[numInjuries - 1].exists == true)
        {
            
            for(var i = 0; i < (numInjuries - 1); i++)
            {
                for(var j = 0; j < (numInjuries - 1); j++)
                {
                    if(overlap(injuries, bandages))
                    {
                        collisionHandler(injuryArr[i], bandageArr[j], i, j);
                    }
                }
            }
        } 
        
      /*  if(overlap(injuries, bandages))
        {
            collisionHandler.call(injuryArr[i], bandageArr[j], i, j);
        } */

        if(numInjuries <= 0)
        {
            alert('newPerson in update activated');
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
        
         for (var i = 0; i < numInjuries; i++)
        {
            var injury = injuries.create(game.rnd.integerInRange(INJURY_RANGE_MIN, INJURY_RANGE_MAX), game.rnd.integerInRange(50, 595), 'blood');
            injuryArr[i] = injury;
            x = injuryArr[i].x;
            y = injuryArr[i].y;
            
            //makes sure injuries show up on the body and not between the legs etc
            while((injuryArr[i].x > 378 && injuryArr[i].x < 426 && injuryArr[i].y > 435))
            {
                injuryArr[i].x = game.rnd.integerInRange(INJURY_RANGE_MIN, INJURY_RANGE_MAX);
                injuryArr[i].y = game.rnd.integerInRange(50, 595);
            }
            
            injuryArr[i].name = 'injury' + i;
            injuryArr[i].body.immovable = true;
            injuryArr[i].inputEnabled = true;
            injuryArr[i].scale.set(.5);
            
            var bandage = bandages.create(50, 50, 'bandage');
            bandageArr[i] = bandage;
            bandageArr[i].name = 'bandage' + i;
            bandageArr[i].body.immovable = false;
            bandageArr[i].inputEnabled = true;
            bandageArr[i].input.enableDrag(false, true);
            bandageArr[i].scale.set(.5);
            
        //    injury.events.onInputDown.add(arrowRelease, this);
        }
     }
     
     function collisionHandler (injury, bandage, injuryIndex, bandageIndex) 
    {
        peopleSaved += 1;
        injuriesLeft -= 1;
        
        savedText.text = '' + peopleSaved;
        
        //alert(injury.name);
        
        injuryArr[injuryIndex].destroy();
        bandageArr[bandageIndex].destroy();
        
      /*  if(injuriesLeft <= 0)
        {
            alert('newPerson in collisionHandler activated');
            newPerson();
        } */
    }
    
    function overlap(spriteA, spriteB) 
    {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
    
        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    
    function render() 
    {
//        game.debug.inputInfo(32, 32);
    }
};
