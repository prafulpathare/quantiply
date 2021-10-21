import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  isLoading: boolean = true;

  selectedDate: string = new Date().toISOString().replace(/T/, ' ').split(' ')[0];

  data: DataFrame;

  constructor(
    private mainService: MainService,
    private calendar: NgbCalendar
  ) { 
  }

  ngOnInit(): void {
    this.loadData();
  }

  dateChanged(e: any) {
    let date = new Date(e.target.value);
    let dd = date.getDate();
    let mm = 1 + date.getMonth();
    let yyyy = date.getFullYear();
    this.selectedDate = '' + yyyy;
    if(mm < 10) this.selectedDate += '-0'+ mm;
    else this.selectedDate += '-'+ mm;
    if(dd < 10) this.selectedDate += '-0'+ dd;
    else this.selectedDate += '-'+ dd;
    this.loadData()
  }

  loadData() {
    this.isLoading = true;
    console.log('date', this.selectedDate)
    this.mainService.getData(this.selectedDate).subscribe((data: DataFrame) => {
      this.data = data;
      if(this.data.media_type === 'video') {
        this.data.url = this.data.url.split('embed/')[1].split('?')[0];
      }
      this.isLoading = false;
    })
  }
}

export interface DataFrame {
  url: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
}