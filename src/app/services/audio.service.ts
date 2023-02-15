import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Pipe } from '@angular/core';
import * as moment from 'moment';
import { StreamState } from '../interface/stream-state';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
private stop$ = new Subject();
private audioObject = new Audio();

audioEvents = [
  "ended", "error", "play", "playing", "pause", "timeupdate", "canplay", "loadedmetadata", "loadstart"
];

private state:StreamState = {
  playing:false,
  readableCurrentTime:'',
  readableDuration:'',
  duration:undefined,
  currentTime:undefined,
  canplay:false,
  error:false
}

// streamObservble
private streamObservable(url:any){
  return new Observable(observer =>{

    // play audio
    this.audioObject.src = url;
    this.audioObject.load();
    this.audioObject.play();

    const handler = (event:Event) =>{
      this.updateStateEvents(event);
      observer.next(event);
    };

    this.addEvents(this.audioObject, this.audioEvents,handler);
    return () =>{

      // stop playing
        this.audioObject.pause();
        this.audioObject.currentTime = 0;

        // remove event listners
        this.removeEvents(this.audioObject, this.audioEvents, handler);

        // reset state
        this.resetState();

    };
  });
}

// add event
  private addEvents(obj:any, events:any, handler:any) {
    events.forEach((event:any) => {
      obj.addEventListener(event, handler);
    });
  }

  // remover event
  private removeEvents(obj:any, events:any, handler:any) {
    events.forEach((event:any) => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: any) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObject.play();
  }

  pause() {
    this.audioObject.pause();
  }

  stop() {
    this.stop$.next(true);
  }

  seekTo(seconds: any) {
    this.audioObject.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObject.duration;
        break;

      case "playing":
        this.state.playing = true;
        this.state.currentTime = this.audioObject.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;

      case "pause":
        this.state.playing = false;
        break;

      case "timeupdate":
        this.state.currentTime = this.audioObject.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;

      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }

    this.stateChange.next(this.state);
  }

  // reset state
  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
    }
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

}
