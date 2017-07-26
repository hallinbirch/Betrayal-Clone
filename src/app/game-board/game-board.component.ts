import { Component, OnInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {CharacterService} from '../character.service';
import {Character} from '../character.model';
import {Speed} from '../speed.model';
import {Might} from '../might.model';
import {Knowledge} from '../knowledge.model';
import {Sanity} from '../sanity.model';
import {Room} from '../room.model';
import {Router} from '@angular/router';
import {GameService} from '../game.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  host: {'(document:keyup)': 'handleKeyboardEvent($event)'},
  providers: [GameService, CharacterService]
})


export class GameBoardComponent implements OnInit {
  staticRoomTiles;
  entranceHall;
  foyer;
  grandStaircase;
  chosenEvent;
  chosenOmen;
  key;
  currentRoomTileArray: any[] = [];
  currentRoomTileId;
  startScreen: boolean = true;
  groundShow: boolean = true;
  upstairsShow: boolean = false;
  basementShow: boolean = false;
  selectedCharacters: Character[] = [];
  selectedCharacter;
  selectedFriend;
  cardId;
  currentSanityIndex: any = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  currentKnowledgeIndex: any = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  currentMightIndex: any = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  currentSpeedIndex: any = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  rollSanity: boolean = false;
  rollSpeed: boolean = false;
  rollMight: boolean = false;
  rollKnowledge: boolean = false;
  statAffectedArray;
  hauntCounter: number = 0;
  haunt: boolean = false;
  death: boolean = false;

constructor(private database: AngularFireDatabase, private gameService: GameService, private characterService: CharacterService) { }

  omenCardResolution(){
    this.hauntCounter += 1;
    var hauntDieRoll = this.gameService.diceToRoll(6);
    if(this.hauntCounter <= hauntDieRoll){
      this.haunt = false;
    }else{
      this.haunt = true;
    }
    console.log(this.haunt + " haunt after roll");
    this.gameService.getOmenCardById(this.gameService.getRandomNumber(0,7)).subscribe(dataLastEmittedFromObserver => {
      this.chosenOmen = dataLastEmittedFromObserver;
      console.log("omen card: " + this.chosenOmen.omen);
      console.log("omen card: " + this.chosenOmen.description);
      this.cardId = dataLastEmittedFromObserver.$key;
      this.statAffectedArray = this.gameService.getOmenCardEffects(this.cardId);
      // console.log("stat affected array " + this.statAffectedArray);
      var stat = this.statAffectedArray[0];
      var amount = this.statAffectedArray[1];
      if(stat === "sanity"){
        console.log("omen sanity " + this.currentSanityIndex);

        // if(this.currentSanityIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('sanity');
        //   tag.getElementsByClassName(this.currentSanityIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentSanityIndex += addLifeRoll;
        // }
        if((this.currentSanityIndex <= 0 || (this.currentSanityIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('sanity');
        tag.getElementsByClassName(this.currentSanityIndex)[0].classList.remove('highlighted');
        if((this.haunt === false || this.haunt === true) && this.currentSanityIndex + amount > 8){
          this.currentSanityIndex = 8;
        }else if(this.haunt === false && (this.currentSanityIndex + amount < 1)){
          this.currentSanityIndex = 1;
        }
        else{
          this.currentSanityIndex += Number(amount);
        }
        // console.log("currentSanityIndex: " + this.currentSanityIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentSanityIndex)[0].classList.add('highlighted');
        }
        console.log("omen sanity after " + this.currentSanityIndex);
        if(this.currentSanityIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "speed"){
        console.log("omen speed " + this.currentSpeedIndex);

      //   if(this.currentSpeedIndex <= 0 && this.haunt === false){
      //     console.log("reroll your life");
      //     var tag = document.getElementById('speed');
      //     tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.remove('highlighted');
      //    var addLifeRoll = this.gameService.diceToRoll(3);
      //    if(addLifeRoll === 0){
      //      this.death = true;
      //    }
      //    this.currentSpeedIndex += addLifeRoll;
      //  }
       if((this.currentSpeedIndex <= 0 || (this.currentSpeedIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('speed');
        tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.remove('highlighted');
        if((this.haunt === false || this.haunt === true) && this.currentSpeedIndex + amount > 8){
          this.currentSpeedIndex = 8;
        }else if(this.haunt === false && (this.currentSpeedIndex + amount < 1)){
          this.currentSpeedIndex = 1;
        }
        else{
          this.currentSpeedIndex += Number(amount);
        }
        // console.log("currentSpeedIndex: " + this.currentSpeedIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.add('highlighted');
        }
        console.log("omen speed after " + this.currentSpeedIndex);
        if(this.currentSpeedIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "might"){
        console.log("omen might " + this.currentMightIndex);
        // if(this.currentMightIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('might');
        //   tag.getElementsByClassName(this.currentMightIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentMightIndex += addLifeRoll;
        // }
        if((this.currentMightIndex <= 0 || (this.currentMightIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('might');
        tag.getElementsByClassName(this.currentMightIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentMightIndex + amount > 8){
          this.currentMightIndex = 8;
        }else if(this.haunt === false && (this.currentMightIndex + amount < 1)){
          this.currentMightIndex = 1;
        }
        else{
          this.currentMightIndex += Number(amount);
        }
        // console.log("currentMightIndex: " + this.currentMightIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentMightIndex)[0].classList.add('highlighted');
        }
        console.log("omen might after " + this.currentMightIndex);
        if(this.currentMightIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "knowledge"){
        console.log("omen knowledge " + this.currentKnowledgeIndex);
        // if(this.currentKnowledgeIndex <= 0 && this.haunt === false){
        //   console.log()
        //   console.log("reroll your life");
        //   var tag = document.getElementById('knowledge');
        //   tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentKnowledgeIndex += addLifeRoll;
        // }
        if((this.currentKnowledgeIndex <= 0 || (this.currentKnowledgeIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('knowledge');
        tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentKnowledgeIndex + amount > 8){
          this.currentKnowledgeIndex = 8;
        }else if(this.haunt === false && (this.currentKnowledgeIndex + amount < 1)){
          this.currentKnowledgeIndex = 1;
        }
        else{
          this.currentKnowledgeIndex += Number(amount);
        }
        // console.log("currentKnowledgeIndex: " + this.currentKnowledgeIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.add('highlighted');
        }
        console.log("omen knowledge after " + this.currentKnowledgeIndex);
        if(this.currentKnowledgeIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
    })
  }

  eventCardResolution(){
    this.gameService.getEventCardById(this.gameService.getRandomNumber(0,24)).subscribe(dataLastEmittedFromObserver => {
      this.chosenEvent = dataLastEmittedFromObserver;
      console.log("event card: " + this.chosenEvent.event);
      console.log("event card: " + this.chosenEvent.description);
      this.cardId = dataLastEmittedFromObserver.$key;
      if(this.chosenEvent.sanity){
        this.rollSanity = true;
        this.statAffectedArray = this.gameService.getEventCardEffects(this.cardId, 0, 0, this.selectedCharacter.sanity.statArray[this.currentSanityIndex], 0);
      }
      else if(this.chosenEvent.speed){
        this.rollSpeed = true;
        this.statAffectedArray = this.gameService.getEventCardEffects(this.cardId,  this.selectedCharacter.speed.statArray[this.currentSpeedIndex], 0, 0, 0);
      }
      else if(this.chosenEvent.might){
        this.rollMight = true;
        this.statAffectedArray = this.gameService.getEventCardEffects(this.cardId, 0, this.selectedCharacter.might.statArray[this.currentMightIndex],  0, 0);
      }
      else if(this.chosenEvent.knowledge){
        this.rollKnowledge = true;
        this.statAffectedArray = this.gameService.getEventCardEffects(this.cardId, 0, 0, 0, this.selectedCharacter.knowledge.statArray[this.currentKnowledgeIndex]);
      }
      else{
        this.statAffectedArray = this.gameService.getEventCardEffects(this.cardId);
      }
      // console.log("stat affected array " + this.statAffectedArray);
      var stat = this.statAffectedArray[0];
      var amount = this.statAffectedArray[1];
      if(stat === "sanity"){
        console.log("event sanity " + this.currentSanityIndex);
        // if(this.currentSanityIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('sanity');
        //   tag.getElementsByClassName(this.currentSanityIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentSanityIndex += addLifeRoll;
        // }
        if((this.currentSanityIndex <= 0 || (this.currentSanityIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('sanity');
        tag.getElementsByClassName(this.currentSanityIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentSanityIndex + amount > 8){
          this.currentSanityIndex = 8;
        }else if(this.haunt === false && (this.currentSanityIndex + amount < 1)){
          this.currentSanityIndex = 1;
        }
        else{
          this.currentSanityIndex += Number(amount);
        }
        // console.log("currentSanityIndex: " + this.currentSanityIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentSanityIndex)[0].classList.add('highlighted');
        }
        console.log("event sanity after " + this.currentSanityIndex);
        if(this.currentSanityIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "speed"){
        console.log("event speed " + this.currentSpeedIndex);
        // if(this.currentSpeedIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('speed');
        //   tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.remove('highlighted');
        //  var addLifeRoll = this.gameService.diceToRoll(3);
        //  if(addLifeRoll === 0){
        //    this.death = true;
        //  }
        //  this.currentSpeedIndex += addLifeRoll;
        // }
        if((this.currentSpeedIndex <= 0 || (this.currentSpeedIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('speed');
        tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentSpeedIndex + amount > 8){
          this.currentSpeedIndex = 8;
        }else if(this.haunt === false && (this.currentSpeedIndex + amount < 1)){
          this.currentSpeedIndex = 1;
        }
        else{
          this.currentSpeedIndex += Number(amount);
        }
        // console.log("currentSpeedIndex: " + this.currentSpeedIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.add('highlighted');
        }
        console.log("event speed after " + this.currentSpeedIndex);
        if(this.currentSpeedIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "might"){
        console.log("event might " + this.currentMightIndex);
        // if(this.currentMightIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('might');
        //   tag.getElementsByClassName(this.currentMightIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentMightIndex += addLifeRoll;
        // }
        if((this.currentMightIndex <= 0 || (this.currentMightIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('might');
        tag.getElementsByClassName(this.currentMightIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentMightIndex + amount > 8){
          this.currentMightIndex = 8;
        }else if(this.haunt === false && (this.currentMightIndex + amount < 1)){
          this.currentMightIndex = 1;
        }
        else{
          this.currentMightIndex += Number(amount);
        }
        // console.log("currentMightIndex: " + this.currentMightIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentMightIndex)[0].classList.add('highlighted');
        }
        console.log("event might after " + this.currentMightIndex);
        if(this.currentMightIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
      else if(stat === "knowledge"){
        console.log("event knowledge " + this.currentKnowledgeIndex);
        // if(this.currentKnowledgeIndex <= 0 && this.haunt === false){
        //   console.log("reroll your life");
        //   var tag = document.getElementById('knowledge');
        //   tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.remove('highlighted');
        //   var addLifeRoll = this.gameService.diceToRoll(3);
        //   if(addLifeRoll === 0){
        //     this.death = true;
        //   }
        //   this.currentKnowledgeIndex += addLifeRoll;
        // }
        if((this.currentKnowledgeIndex <= 0 || (this.currentKnowledgeIndex + amount < 1)) && this.haunt === true){
          console.log("dead? " + this.death);
          this.death = true;
        }
        var tag = document.getElementById('knowledge');
        tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.remove('highlighted');
        if((this.haunt === true || this.haunt === false) && this.currentKnowledgeIndex + amount > 8){
          this.currentKnowledgeIndex = 8;
        }else if(this.haunt === false && (this.currentKnowledgeIndex + amount < 1)){
          this.currentKnowledgeIndex = 1;
        }
        else{
          this.currentKnowledgeIndex += Number(amount);
        }
        // console.log("currentKnowledgeIndex: " + this.currentKnowledgeIndex);
        if(this.death === false){
          tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.add('highlighted');
        }
        console.log("event knowledge after " + this.currentKnowledgeIndex);
        if(this.currentKnowledgeIndex <=0 && this.haunt === true){
          this.death = true;
        }
      }
    })
  }

  handleKeyboardEvent(event: KeyboardEvent){
    this.key = event.which || event.keyCode;

    //enter Key to start game
    if(this.key === 13){
      this.startScreen = false;
      var tag = document.getElementById('knowledge');
      tag.getElementsByClassName(this.currentKnowledgeIndex)[0].classList.add('highlighted');
      var tag = document.getElementById('speed');
      tag.getElementsByClassName(this.currentSpeedIndex)[0].classList.add('highlighted');
      var tag = document.getElementById('might');
      tag.getElementsByClassName(this.currentMightIndex)[0].classList.add('highlighted');
      var tag = document.getElementById('sanity');
      tag.getElementsByClassName(this.currentSanityIndex)[0].classList.add('highlighted');
    }
    if(this.death === true && (this.key === 37 || this.key === 38 || this.key === 39 || this.key === 40)){
      console.log("it is the " + this.death + " death");
    }
    else{
      //go downstairs from upper landing
      if(this.currentRoomTileId === 95 && this.key === 13){
        this.currentRoomTileId = 37;
        this.groundShow = true;
        this.upstairsShow = false;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('95').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
      }
      //up to foyer from basement stairs
      if(this.key === 38 && this.currentRoomTileId === 201){
        this.currentRoomTileId = 38;
        this.groundShow = true;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('201').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
      }
      //up
      else if(this.key === 38 && (this.currentRoomTileId === 37 || this.currentRoomTileId === 32 || this.currentRoomTileId === 23 || this.currentRoomTileId === 22 || this.currentRoomTileId === 21 || this.currentRoomTileId === 81 || this.currentRoomTileId === 48 || this.currentRoomTileId === 87 || this.currentRoomTileId === 88 || this.currentRoomTileId === 104 || this.currentRoomTileId === 203 || this.currentRoomTileId === 202 || this.currentRoomTileId === 225 || this.currentRoomTileId === 228 || this.currentRoomTileId === 38)){
        // console.log("FACEPLANT LOL");
      }
      else if(this.key === 38){
        this.currentRoomTileId -= 8;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('39').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 31){
          this.currentRoomTileArray[0].classList.add('bloodyRoom');
        }
        else if(this.currentRoomTileId === 23){
          if(!this.currentRoomTileArray[0].classList.contains('graveyard')){
            this.currentRoomTileArray[0].classList.add('graveyard');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 22){
          if(!this.currentRoomTileArray[0].classList.contains('ballroom')){
            this.currentRoomTileArray[0].classList.add('ballroom');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 46){
          if(!this.currentRoomTileArray[0].classList.contains('statuaryCorridor')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('statuaryCorridor');
          }
        }
        else if(this.currentRoomTileId === 87){
          if(!this.currentRoomTileArray[0].classList.contains('operatingLaboratory')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('operatingLaboratory');
          }
        }
        else if(this.currentRoomTileId === 97){
          if(!this.currentRoomTileArray[0].classList.contains('balcony')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('balcony');
          }
        }
        else if(this.currentRoomTileId === 89){
          this.currentRoomTileArray[0].classList.add('creakyHallway');
        }
        else if(this.currentRoomTileId === 81){
          if(!this.currentRoomTileArray[0].classList.contains('attic')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('attic');
          }
        }
        else if(this.currentRoomTileId === 218){
          if(!this.currentRoomTileArray[0].classList.contains('catacombs')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('catacombs');
          }
        }
        else if(this.currentRoomTileId === 219){
          this.currentRoomTileArray[0].classList.add('wineCellar');
        }
        else if(this.currentRoomTileId === 210){
          if(!this.currentRoomTileArray[0].classList.contains('servantsQuarters')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('servantsQuarters');
          }
        }
        else if(this.currentRoomTileId === 211){
          if(!this.currentRoomTileArray[0].classList.contains('furnaceRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('furnaceRoom');
          }
        }
        else if(this.currentRoomTileId === 202){
          if(!this.currentRoomTileArray[0].classList.contains('organRoom')){
            this.currentRoomTileArray[0].classList.add('organRoom');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 203){
          if(!this.currentRoomTileArray[0].classList.contains('gymnasium')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('gymnasium');
          }
        }
        else if(this.currentRoomTileId === 201){
          this.currentRoomTileArray[0].classList.add('stairsFromBasement');
        }
      }

      //down to the basement from the coal coalChute
      if(this.currentRoomTileId === 55){
        this.currentRoomTileId = 226;
        this.groundShow = false;
        this.basementShow = true;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('39').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 226){
          this.currentRoomTileArray[0].classList.add("basementLanding");
        }
      }
      //down
      else if(this.key === 40 && (this.currentRoomTileId === 29 || this.currentRoomTileId === 37 || this.currentRoomTileId === 62 || this.currentRoomTileId === 56 || this.currentRoomTileId === 32 || this.currentRoomTileId === 30 || this.currentRoomTileId === 88 || this.currentRoomTileId === 104 || this.currentRoomTileId === 113 || this.currentRoomTileId === 119 || this.currentRoomTileId === 209 || this.currentRoomTileId === 228 || this.currentRoomTileId === 225 || this.currentRoomTileId === 235 || this.currentRoomTileId === 250)){
        // console.log("FACEPLANT LOL");
      }
      else if(this.key === 40){
        this.currentRoomTileId += 8;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('39').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 29){
          if(!this.currentRoomTileArray[0].classList.contains('conservatory')){
            this.currentRoomTileArray[0].classList.add('conservatory');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 46){
          if(!this.currentRoomTileArray[0].classList.contains('statuaryCorridor')){
            this.currentRoomTileArray[0].classList.add('statuaryCorridor');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 54){
          if(!this.currentRoomTileArray[0].classList.contains('gameRoom')){
            this.currentRoomTileArray[0].classList.add('gameRoom');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 62){
          if(!this.currentRoomTileArray[0].classList.contains('kitchen')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('kitchen');
          }
        }
        else if(this.currentRoomTileId === 47){
          if(!this.currentRoomTileArray[0].classList.contains('abandonedRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('abandonedRoom');
          }
        }
        else if(this.currentRoomTileId === 55){
          this.currentRoomTileArray[0].classList.add('coalChute');
        }
        else if(this.currentRoomTileId === 56){
          if(!this.currentRoomTileArray[0].classList.contains('gardens')){
            this.currentRoomTileArray[0].classList.add('gardens');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 97){
          if(!this.currentRoomTileArray[0].classList.contains('balcony')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('balcony');
          }
        }
        else if(this.currentRoomTileId === 103){
          if(!this.currentRoomTileArray[0].classList.contains('charredRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('charredRoom');
          }
        }
        else if(this.currentRoomTileId === 111){
          if(!this.currentRoomTileArray[0].classList.contains('gallery')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('gallery');
          }
        }
        else if(this.currentRoomTileId === 119){
          this.currentRoomTileArray[0].classList.add('storeroom');
        }
        else if(this.currentRoomTileId === 105){
          this.currentRoomTileArray[0].classList.add('collapsedRoom');
        }
        else if(this.currentRoomTileId === 113){
          if(!this.currentRoomTileArray[0].classList.contains('chapel')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('chapel');
          }
        }
        else if(this.currentRoomTileId === 234){
          this.currentRoomTileArray[0].classList.add('larder');
        }
        else if(this.currentRoomTileId === 235){
          if(!this.currentRoomTileArray[0].classList.contains('crypt')){
            this.currentRoomTileArray[0].classList.add('crypt');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 242){
          if(!this.currentRoomTileArray[0].classList.contains('researchLaboratory')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('researchLaboratory');
          }
        }
        else if(this.currentRoomTileId === 250){
          if(!this.currentRoomTileArray[0].classList.contains('vault')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('vault');
          }
        }
        else if(this.currentRoomTileId === 227){
          this.currentRoomTileArray[0].classList.add('dustyHallway');
        }
        else if(this.currentRoomTileId === 219){
          this.currentRoomTileArray[0].classList.add('wineCellar');
        }
        else if(this.currentRoomTileId === 218){
          if(!this.currentRoomTileArray[0].classList.contains('catacombs')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('catacombs');
          }
        }
      }

      //right
      if(this.key === 39 && (this.currentRoomTileId === 22 || this.currentRoomTileId === 23 || this.currentRoomTileId === 29 || this.currentRoomTileId === 32 || this.currentRoomTileId === 39 || this.currentRoomTileId === 46 || this.currentRoomTileId === 48 || this.currentRoomTileId === 56 || this.currentRoomTileId === 55 || this.currentRoomTileId === 54 || this.currentRoomTileId === 62 || this.currentRoomTileId === 81 || this.currentRoomTileId === 89 || this.currentRoomTileId === 97 || this.currentRoomTileId === 95 || this.currentRoomTileId === 105 || this.currentRoomTileId === 113 || this.currentRoomTileId === 111 || this.currentRoomTileId === 119 || this.currentRoomTileId === 201 || this.currentRoomTileId === 202 || this.currentRoomTileId === 203 || this.currentRoomTileId === 211 || this.currentRoomTileId === 218 || this.currentRoomTileId === 219 || this.currentRoomTileId === 228 || this.currentRoomTileId === 235 || this.currentRoomTileId === 234 || this.currentRoomTileId === 242 || this.currentRoomTileId === 250)){
        // console.log("FACEPLANT LOL");
      }
      else if(this.key === 39){
        this.currentRoomTileId += 1;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('39').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 32){
          if(!this.currentRoomTileArray[0].classList.contains('library')){
            this.currentRoomTileArray[0].classList.add('library');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 48){
          if(!this.currentRoomTileArray[0].classList.contains('patio')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('patio');
          }
        }
        else if(this.currentRoomTileId === 88){
          if(!this.currentRoomTileArray[0].classList.contains('tower')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('tower');
          }
        }
        else if(this.currentRoomTileId === 89){
          this.currentRoomTileArray[0].classList.add('creakyHallway');
        }
        else if(this.currentRoomTileId === 104){
          if(!this.currentRoomTileArray[0].classList.contains('bedroom')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('bedroom');
          }
        }
        else if(this.currentRoomTileId === 105){
          this.currentRoomTileArray[0].classList.add('collapsedRoom');
        }
        else if(this.currentRoomTileId === 106){
          if(!this.currentRoomTileArray[0].classList.contains('masterBedroom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('masterBedroom');
          }
        }
        //basement
        else if(this.currentRoomTileId === 227){
          this.currentRoomTileArray[0].classList.add('dustyHallway');
        }
        else if(this.currentRoomTileId === 228){
          this.currentRoomTileArray[0].classList.add('chasm');
        }
        else if(this.currentRoomTileId === 211){
          if(!this.currentRoomTileArray[0].classList.contains('furnaceRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('furnaceRoom');
          }
        }
      }

      //left movement to upstairs from grand staircase
      if(this.key === 37 && this.currentRoomTileId === 37){
        this.groundShow = false;
        this.upstairsShow = true;
        this.currentRoomTileId = 95;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('37').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 95){
          this.currentRoomTileArray[0].classList.add("upperLanding");
        }
      }
      //left
      else if(this.key === 37 && (this.currentRoomTileId === 21 || this.currentRoomTileId === 23 || this.currentRoomTileId === 29 || this.currentRoomTileId === 30 || this.currentRoomTileId === 54 || this.currentRoomTileId === 46 || this.currentRoomTileId === 62 || this.currentRoomTileId === 56 || this.currentRoomTileId === 55 || this.currentRoomTileId === 81 || this.currentRoomTileId === 87 || this.currentRoomTileId === 95 || this.currentRoomTileId === 103 || this.currentRoomTileId === 111 || this.currentRoomTileId === 119 || this.currentRoomTileId === 113 || this.currentRoomTileId === 97 || this.currentRoomTileId === 201 || this.currentRoomTileId === 209 || this.currentRoomTileId === 218 || this.currentRoomTileId === 202 || this.currentRoomTileId === 203 || this.currentRoomTileId === 219 || this.currentRoomTileId === 225 || this.currentRoomTileId === 234 || this.currentRoomTileId === 235 || this.currentRoomTileId === 242 || this.currentRoomTileId === 250 || this.currentRoomTileId === 47)){
        // console.log("FACEPLANT LOL");
      }
      else if(this.key === 37){
        this.currentRoomTileId -= 1;
        if (this.currentRoomTileArray.length === 0) {
          document.getElementById('39').classList.remove('active');
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        } else {
          this.currentRoomTileArray[0].classList.remove('active');
          this.currentRoomTileArray = [];
          this.currentRoomTileArray.push(document.getElementById(this.currentRoomTileId))
          this.currentRoomTileArray[0].classList.add('active');
        }
        if(this.currentRoomTileId === 30){
          if(!this.currentRoomTileArray[0].classList.contains('diningRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('diningRoom');
          }
        }
        else if(this.currentRoomTileId === 21){
          if(!this.currentRoomTileArray[0].classList.contains('junkroom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('junkroom');
          }
        }
        else if(this.currentRoomTileId === 87){
          if(!this.currentRoomTileArray[0].classList.contains('operatingLaboratory')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('operatingLaboratory');
          }
        }
        else if(this.currentRoomTileId === 88){
          if(!this.currentRoomTileArray[0].classList.contains('tower')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('tower');
          }
        }
        else if(this.currentRoomTileId === 103){
          if(!this.currentRoomTileArray[0].classList.contains('charredRoom')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('charredRoom');
          }
        }
        else if(this.currentRoomTileId === 104){
          if(!this.currentRoomTileArray[0].classList.contains('bedroom')){
            this.eventCardResolution();
            this.currentRoomTileArray[0].classList.add('bedroom');
          }
        }
        //basement
        else if(this.currentRoomTileId === 210){
          if(!this.currentRoomTileArray[0].classList.contains('servantsQuarters')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('servantsQuarters');
          }
        }
        else if(this.currentRoomTileId === 209){
          if (!this.currentRoomTileArray[0].classList.contains('undergroundLake')){
            this.currentRoomTileArray[0].classList.add('undergroundLake');
            this.eventCardResolution();
          }
        }
        else if(this.currentRoomTileId === 225){
          if(!this.currentRoomTileArray[0].classList.contains('pentagramChamber')){
            this.omenCardResolution();
            this.currentRoomTileArray[0].classList.add('pentagramChamber');
          }
        }
      }
    }
  }

  getCharacterById(charId: string){
    return this.database.object('/selectedCharacters/' + charId);
  }


  //NOTE:need to remove old characters from database on new game?
  ngOnInit() {
    this.currentRoomTileId = 39;
    this.characterService.getSelectedCharacters().subscribe(dataLastEmittedFromObserver =>{
      if(dataLastEmittedFromObserver.length > 2){
        for(var i=0; i < (dataLastEmittedFromObserver.length-2); i++){
          var charToRemove = this.getCharacterById(dataLastEmittedFromObserver[i].$key);
          charToRemove.remove();
        }
      }
      this.selectedCharacter = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-2];
      this.selectedFriend = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-1];
      this.currentSanityIndex = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-2].sanity.initialIndex;
      this.currentKnowledgeIndex = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-2].knowledge.initialIndex;
      this.currentSpeedIndex = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-2].speed.initialIndex;
      this.currentMightIndex = dataLastEmittedFromObserver[dataLastEmittedFromObserver.length-2].might.initialIndex;
    })


    this.gameService.getStaticRoomTiles().subscribe(dataLastEmittedFromObserver => {
      this.staticRoomTiles = dataLastEmittedFromObserver;
      this.entranceHall = dataLastEmittedFromObserver[0];
      this.foyer = dataLastEmittedFromObserver[1];
      this.grandStaircase = dataLastEmittedFromObserver[2];
    })
  }

}
