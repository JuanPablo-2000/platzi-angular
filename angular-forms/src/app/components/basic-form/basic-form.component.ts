import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { 
  FormControl, 
  FormGroup, 
  FormBuilder, 
  Validators} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})

export class BasicFormComponent implements OnInit {

  form: FormGroup;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
  allComplete: boolean = false;

  task: Task = {
    name: 'Cursos',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'}
    ]
  };

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(
    private observer: BreakpointObserver,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit(): void {
    // this.nameField.valueChanges
    // .subscribe(value => {
    //   console.log(value);
    // });
    // this.form.valueChanges
    // .subscribe(value => {
    //   console.log(value);
    // });
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 700px']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  getNameValue() {
    
  }

  save(event) {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
    fullName: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z]+$/)]],
      last: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z]+$/)]]
    }),
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    color: ['#000000'],
    date: [''],
    age: [18,[Validators.required, Validators.min(18), Validators.max(100)]],
    category: [''],
    tag: [''],
    agree: [false, [Validators.requiredTrue]],
    gender: [''],
    zone: [''],
    select: [''],
    });
  }

  get nameField() {
    return this.form.get('fullName.name');
  }

  get lastField() {
    return this.form.get('fullName.last');
  }

  get emailField() {
    return this.form.get('email');
  }

  get phoneField() {
    return this.form.get('phone');
  }

  get colorField() {
    return this.form.get('color');
  }

  get dateField() {
    return this.form.get('date');
  }

  get ageField() {
    return this.form.get('age');
  }

  get categoryField() {
    return this.form.get('category');
  }

  get tagField() {
    return this.form.get('tag');
  }

  get agreeField() {
    return this.form.get('agree');
  }

  get genderField() {
    return this.form.get('gender');
  }

  get zoneField() {
    return this.form.get('zone');
  }

  get selectField() {
    return this.form.get('select');
  }

  get isNameFieldValid() {
    return this.nameField.dirty && this.nameField.valid;
  }

  get isNameFieldInvalid() {
    return this.nameField.dirty && this.nameField.invalid;
  }

  get isLastFieldValid() {
    return this.lastField.dirty && this.lastField.valid;
  }

  get isLastFieldInvalid() {
    return this.lastField.dirty && this.lastField.invalid;
  }

  get isPhoneFieldValid() {
    return this.phoneField.dirty && this.phoneField.valid;
  }

  get isPhoneFieldInvalid() {
    return this.phoneField.dirty && this.phoneField.invalid;
  }

  get isEmailFieldValid() {
    return this.emailField.dirty && this.emailField.valid;
  }

  get isEmailFieldInvalid() {
    return this.emailField.dirty && this.emailField.invalid;
  }

  get isAgeFieldValid() {
    return this.ageField.dirty && this.ageField.valid;
  }

  get isAgeFieldInvalid() {
    return this.ageField.dirty && this.ageField.invalid;
  }

}