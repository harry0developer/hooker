import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent {

  @Input() text: string;
  @Input() pic?: string;
  @Input() timestamp: string;
  @Input() position: 'start' | 'end' = 'start';

  constructor() {
  }

  isPostionStart(): boolean {
    return this.position.toLocaleLowerCase() === 'start';
  }

}
