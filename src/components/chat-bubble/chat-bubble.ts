import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent {

  @Input() text: string;
  @Input() pic: string;
  @Input() position: 'start' | 'end' = 'start';

  constructor() {
  }

  ionViewDidLoad() {
    console.log(this.text);
    console.log(this.position);
    console.log(this.pic);
  }

  ionViewDidEnter() {
    console.log(this.text);
    console.log(this.position);
    console.log(this.pic);

  }

  isPostionStart(): boolean {
    return this.position.toLocaleLowerCase() === 'start';
  }

}
