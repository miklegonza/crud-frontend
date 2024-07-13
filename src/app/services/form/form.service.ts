import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    private data = new BehaviorSubject({title: 'Crear persona', id: 0});
    getData = this.data.asObservable();

    constructor() {}

    setData(title: string, id: number = 0) {
        this.data.next({title, id});
    }
}
