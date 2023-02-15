import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { StreamState } from '../interface/stream-state';
import { AudioService } from '../services/audio.service';
import { CloudService } from '../services/cloud.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {}; 

  view:any = '';
  viewhide:boolean = true;

  // introduction
  introduction:boolean = false;
 
  clickIntro(){
    this.introduction =  true;
  }

  viewsend(value:any){
    
  }

  closeview(){
    this.view = '';
    this.viewhide = true;
  }

  // songs
  bollywood() {
    this.cloudService.getFilesB().subscribe(files => {
      this.files = files;
    });
  }

  punjabi() {
    this.cloudService.getFilesP().subscribe(files => {
      this.files = files;
    });
  }

  marathi() {
    this.cloudService.getFilesM().subscribe(files => {
      this.files = files;
    });
  }

  southindian() {
    this.cloudService.getFilesS().subscribe(files => {
      this.files = files;
    });
  }

  constructor(private audioService: AudioService, private cloudService: CloudService) {

    // get media files
    cloudService.getFilesM().subscribe((files:any) => {
      this.files = files;
    });

    // listen to stream state
    this.audioService.getState().subscribe((state:any) => {
      this.state = state;
    });
  }


  // play stream
  playStream(url: any) {
    this.audioService.playStream(url).subscribe((events:any) => {
      // listening for fun here
    });
  }

  // openFile
  openFile(file:any, index:any, value:any) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);

    this.view = value;
    this.viewhide = false;
  }

  // pause method
  pause() {
    this.audioService.pause();
  }

  // play method
  play() {
    this.audioService.play();
  }

  // stop method
  stop() {
    this.audioService.stop();

    // this.view = '';
    // this.viewhide = true;
  }

  // next method
  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index, true);
  }

  // previoud method
  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index, true);
  }

  // isFirst playing
  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  // is last playing
  isLastplaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  // slider change
  onSliderChangeEnd(change:any) {
    this.audioService.seekTo(change.value);
  }

  ngOnInit() {
  }

}

