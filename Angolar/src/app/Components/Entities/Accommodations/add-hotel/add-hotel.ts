import { Component, EventEmitter, Output } from '@angular/core';
import { HotelService } from '../../../../Service/hotel-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccommodationWithoutId } from '../../../../Interfacess/accommodation';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';
import { getCity } from '../../../../Service/city';

@Component({
  selector: 'app-add-hotel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-hotel.html',
  styleUrl: './add-hotel.scss',
  standalone: true
})
export class AddHotel {

  constructor(private hotelService: HotelService,
    private regions: Regions, private cityService: getCity
  ) { this.areaList = this.regions.getAllAreas(); }

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<AccommodationWithoutId>();

  areaList: { id: number, name: string }[] = [];
  cities: string[] = [];


  addAccommodationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    regionId: new FormControl(0, Validators.required),
    address: new FormControl(''),
    description: new FormControl(''),
    numberOfRooms: new FormControl(0, [Validators.required, Validators.min(1)]),
    numberOfBeds: new FormControl(0, [Validators.required, Validators.min(1)]),
    pricePerNight: new FormControl(0, [Validators.required, Validators.min(1)]),
    phoneNumber: new FormControl(''),
  });

  onSubmit() {
    if (this.addAccommodationForm.valid) {
      this.hotelService.addHotel(this.addAccommodationForm.value as AccommodationWithoutId).subscribe({
        next: (response) => {
          this.addAccommodationForm.reset();
          this.updated.emit(this.addAccommodationForm.value as AccommodationWithoutId);
          this.closed.emit();
        },
        error: (error) => {
          console.error('שגיאה בהוספת מקום הלינה:', error);
          console.error('פירוט השרת:', error.error);
        }
      });
    } else {
      console.warn('הטופס אינו תקין; אנא בדוק את השדות');
    }
  }

  ngOnInit() {
    this.cityService.getCities().subscribe(data => {
      if (data.success && data.result && Array.isArray(data.result.records)) {
        this.cities = data.result.records.map(record => record.שם_ישוב.trim()).sort();
      } else {
        console.error('No cities found or response is not in expected format:', data);
      }
      console.log(this.cities)
    });
  }

}
