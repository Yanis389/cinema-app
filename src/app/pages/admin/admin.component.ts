import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Film } from '../interfaces/film.interfaces';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  films: Film[] = [];
  newFilm: Film = { title: '', description: '', genre: '', releaseDate: new Date(), imageUrl: '', likes: 0 };
  editFilm: Film | null = null;

  successMessage: string | null = null;
  editSuccessMessage: string | null = null;
  deleteSuccessMessage: string | null = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  // Charger la liste des films
  loadFilms(): void {
    this.firebaseService.film$.subscribe(films => this.films = films);
  }

  // Ajouter un film
  addFilm(): void {
    this.firebaseService.addFilm(this.newFilm);
    this.successMessage = 'Film ajouté avec succès!';
    this.newFilm = { title: '', description: '', genre: '', releaseDate: new Date(), imageUrl: '', likes: 0 };
    setTimeout(() => this.successMessage = null, 3000); 
  }

  // Modifier un film
  updateFilm(): void {
    if (this.editFilm && this.editFilm.id) {
      this.firebaseService.updateFilm(this.editFilm);
      this.editSuccessMessage = 'Film modifié avec succès!';
      this.editFilm = null;
      setTimeout(() => this.editSuccessMessage = null, 3000); 
    }
  }

  // Supprimer un film
  deleteFilm(id: string): void {
    if (confirm('Supprimer ce film ?')) {
      this.firebaseService.deleteFilm({ id } as Film);
      this.deleteSuccessMessage = 'Film supprimé avec succès!';
      setTimeout(() => this.deleteSuccessMessage = null, 3000); 
    }
  }

  // Mode édition
  editMode(film: Film): void {
    this.editFilm = { ...film };
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.editFilm = null;
  }
}
