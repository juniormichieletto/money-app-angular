import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastyService } from 'ng2-toasty';

import { CategoryService } from './../../categories/category.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Release } from '../../core/model/release.model';
import { ReleaseService } from './../release.service';
import { PeopleService } from './../../people/people.service';

@Component({
  selector: 'app-release-register',
  templateUrl: './release-register.component.html',
  styleUrls: ['./release-register.component.css']
})
export class ReleaseRegisterComponent implements OnInit {

  types = [
    { label: 'Recipe', value: 'RECIPE'},
    { label: 'Expense', value: 'EXPENSE'}
  ];

  categories = [];
  people = [];
  release = new Release();
  releaseId: number;

  constructor(
    private categoryService: CategoryService,
    private peopleService: PeopleService,
    private releaseService: ReleaseService,
    private toastyService: ToastyService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.releaseId = this.route.snapshot.params['id'];

    if (this.releaseId) {
      this.loadRelease(this.releaseId);
    }

    this.loadCategories();
    this.loadPeople();
  }

  save(form: FormControl) {

    if (this.editing) {
      this.update(form);

    } else {
      this.addRelease(form);
    }
  }

  addRelease(form: FormControl) {

    this.releaseService.save(this.release)
      .then(releaseAdded => {
        this.toastyService.success('Release created successful!');
        this.router.navigate(['/releases', releaseAdded.id]);
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  update(form: FormControl) {

    this.releaseService.update(this.release)
      .then(release => {
        this.release = release;

        this.toastyService.success('Release edited successful!');
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  get editing() {
    return Boolean(this.release.id);
  }

  new(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.release = new Release();
    }.bind(this), 1);

    this.router.navigate(['/releases/new']);
  }

  private loadRelease(releaseId: number) {

    this.releaseService.findById(releaseId)
      .then(release => {
        this.release = release;
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  private loadCategories() {
    return this.categoryService.findAll()
      .then(categories => {
        this.categories = categories.map(c => ({ label: c.name, value: c.id }));
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  private loadPeople() {
    return this.peopleService.findAll()
      .then(people => {
        this.people = people.map(p => ({ label: p.name, value: p.id}));
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

}
