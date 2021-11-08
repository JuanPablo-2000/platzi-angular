import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})

export class BasicFormComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.observer.observe(['(max-width: 900px']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.dataSource.paginator = this.paginator;
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