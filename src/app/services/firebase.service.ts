import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, push, ref, remove, update } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { Film } from '../pages/interfaces/film.interfaces';

const firebaseConfig = {
  apiKey: "AIzaSyA4uCpjZu9D7u49Pj5iHCd-rdBpVIbbgXQ",
  authDomain: "cinema-app-d01ae.firebaseapp.com",
  databaseURL: "https://cinema-app-d01ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cinema-app-d01ae",
  storageBucket: "cinema-app-d01ae.firebasestorage.app",
  messagingSenderId: "3185269834",
  appId: "1:3185269834:web:05bbc21de7262bd7125ab3",
  measurementId: "G-VCJSBWKH8Y"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  private db = getDatabase(this.app);
  private filmsRef = ref(this.db, 'films');
  private filmSubject = new BehaviorSubject<Film[]>([]);

  film$ = this.filmSubject.asObservable();

  constructor() {
    this.listenToFilms();
  }

  listenToFilms() {
    onValue(this.filmsRef, (snapshot) => {
      const films: Film[] = [];
      snapshot.forEach((childSnapshot) => {
        films.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        });
      });
      this.filmSubject.next(films);
    });
  }

  addFilm(film: Film) {
    const filmToAdd = {
      ...film,
      releaseDate: film.releaseDate ? (film.releaseDate instanceof Date ? film.releaseDate.toISOString() : film.releaseDate) : null,
      likes: film.likes || 0  
    };
    push(this.filmsRef, filmToAdd);
  }

  updateFilm(film: Film) {
    const filmRef = ref(this.db, `films/${film.id}`);
    return update(filmRef, film)
      .then(() => console.log('Film mis à jour avec succès'))
      .catch(error => console.error('Erreur lors de la mise à jour du film', error));
  }

// Ajouter un like
likeFilm(id: string) {
  const filmRef = ref(this.db, `films/${id}`);
  
  // Utiliser get() pour récupérer les données du film une seule fois
  get(filmRef).then((snapshot: { val: () => any; }) => {
    const filmData = snapshot.val();

    if (filmData) {
      // Incrémenter le nombre de likes
      update(filmRef, {
        likes: filmData.likes + 1
      });
    }
  }).catch((error: any) => {
    console.error('Erreur lors de la récupération des données du film', error);
  });
}
 
    getFilms() {
      return this.film$;
    }

  deleteFilm(film: Film) {
    const filmRef = ref(this.db, `films/${film.id}`);
    return remove(filmRef)
      .then(() => console.log('Film supprimé avec succès'))
      .catch(error => console.error('Erreur lors de la suppression du film', error));
  }

  getFilmData(id: string): Film {
    return {
      id,
      title: '',
      description: '',
      genre: '',
      imageUrl: '',
      releaseDate: new Date(),
      likes: 0 
    };
  }
}
