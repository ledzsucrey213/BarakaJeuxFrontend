import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  games = [
    { title: 'Game 1', seller: 'Seller 1', condition: 'New', price: 10 },
    { title: 'Game 2', seller: 'Seller 2', condition: 'Used', price: 15 },
    { title: 'Game 3', seller: 'Seller 3', condition: 'New', price: 20 },
    { title: 'Game 4', seller: 'Seller 4', condition: 'Used', price: 25 },
    // Ajoutez plus d'exemples si nécessaire
  ];

  constructor() {}

  ngOnInit(): void {}
}
