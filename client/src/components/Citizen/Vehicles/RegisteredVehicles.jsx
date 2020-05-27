import React, { Component } from 'react';
import { backendURL } from '../../../config/config';
import Axios from 'axios';
import Cookies from 'js-cookie';

export default class RegisteredVehicles extends Component {
  constructor() {
    super();

    this.state = {
      vehicles: [],
    };
  }

  getRegisteredVehicles = () => {
    Axios({
      url: backendURL + '/c/vehicles',
      method: 'GET',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    })
      .then((res) => {
        if (res.data.vehicles) {
          this.setState({
            vehicles: res.data.vehicles,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  deleteVehicle = (vehicleId) => {
    Axios({
      url: backendURL + '/c/vehicles/' + vehicleId,
      method: 'DELETE',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      if (res.data.msg === 'Deleted') {
        sessionStorage.setItem('message', 'Successfully Deleted Vehicle!');
        return (window.location = '/citizen');
      }
    });
  };

  componentDidMount() {
    this.getRegisteredVehicles();
  }
  render() {
    const { vehicles } = this.state;
    return (
      <div className='list-group-item list-group-item-action bg-dark text-light border-dark mt-1'>
        <div className='d-flex'>
          <h5 className='mb-1'>Registered Vehicles:</h5>
        </div>

        {!vehicles[0] ? (
          <li className='list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between'>
            No Vehicles Registered
            <a href='/vehicles/register' className='btn btn-primary'>
              Register a Vehicle
            </a>
          </li>
        ) : (
          <>
            <button
              className='btn btn-primary mt-2'
              type='button'
              data-toggle='collapse'
              data-target='#registeredVehicles'
              aria-expanded='false'
              aria-controls='collapseExample'>
              Toggle Registered Vehicles
            </button>
            <div className='collapse mt-2' id='registeredVehicles'>
              {vehicles.map((vehicle, index) => (
                <div key={index}>
                  <li className='list-group-item d-flex justify-content-between bg-secondary border-dark'>
                    <div>
                      {/* Vehicle */}
                      <span className='font-weight-bold'>
                        {vehicle.vehicle}
                      </span>
                      <br />
                      {/* Plate */}
                      <span className='font-weight-bold'>Plate: </span>
                      <span className='uppercase font-weight-normal'>
                        {vehicle.plate}
                      </span>
                      <br />
                      {/* Insurance */}
                      <span className='font-weight-bold'>
                        Insurance Status:
                      </span>
                      <span> {vehicle.in_status}</span> <br />
                      {/* Color */}
                      <span className='font-weight-bold'>Color: </span>
                      {vehicle.color}
                      <br />
                      {/* VIN Number */}
                      <span className='font-weight-bold'>VIN: </span>
                      {vehicle.vin_number} <br />
                      {/* Company */}
                      <span className='font-weight-bold'>Company: </span>
                      {vehicle.company} <br />
                    </div>

                    {/* actions */}
                    <div className=''>
                      {/* <a
                        href={'/vehicles/edit/' + vehicle.id}
                        className='btn btn-primary mr-2'>
                        Report Stolen
                      </a> */}
                      <a
                        href={'/vehicles/edit/' + vehicle.id}
                        className='btn btn-success'>
                        Edit
                      </a>
                      <a
                        href='#deleteVehicle'
                        onClick={() => this.deleteVehicle(vehicle.id)}
                        className='btn btn-danger ml-2'>
                        Delete
                      </a>
                    </div>
                  </li>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}