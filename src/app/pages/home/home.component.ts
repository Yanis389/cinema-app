import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Film } from '../interfaces/film.interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  films: Film[] = [];

  constructor(private filmService: FirebaseService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.filmService.getFilms().subscribe(films => {
      this.films = films;
    });
  }

  // Ajouter un like à un film
  likeFilm(id: string): void {
    this.filmService.likeFilm(id);
  }
}
