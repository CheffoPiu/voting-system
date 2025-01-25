import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: any[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
      this.webSocketService.listen('updateResults').subscribe((data) => {
          this.results = data;
      });
  }
}
