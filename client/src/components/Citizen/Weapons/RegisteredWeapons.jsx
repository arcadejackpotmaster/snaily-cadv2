import React, { Component } from 'react';
import { backendURL } from '../../../config/config';
import Axios from 'axios';
import Cookies from 'js-cookie';
import LoadingArea from "../../Partials/LoadingArea"

export default class RegisteredWeapons extends Component {
  constructor() {
    super();

    this.state = {
      weapons: [],
      loading: true,
    };
  }

  getRegisteredWeapons = () => {
    Axios({
      url: backendURL + '/c/weapons/all/'+this.props.citizenId,
      method: 'GET',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    })
      .then((res) => {
        if (res.data.weapons) {
          this.setState({
            weapons: res.data.weapons,
            loading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  deleteWeapon = (vehicleId) => {
    Axios({
      url: backendURL + '/c/weapons/' + vehicleId,
      method: 'DELETE',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      if (res.data.msg === 'Deleted Weapon') {
        sessionStorage.setItem('message', 'Successfully Deleted Weapon!');
        return (window.location = '/citizen');
      }
    });
  };

  componentDidMount() {
    this.getRegisteredWeapons();
  }
  render() {
    const { weapons, loading } = this.state;
    if (loading) {
      return (
        <div className='container'>
          <LoadingArea />
        </div>
      );
    }
    return (
      <div className='list-group-item list-group-item-action bg-dark text-light border-dark mt-1'>
        <div className='d-flex'>
          <h5 className='mb-1'>Registered Weapons:</h5>
        </div>

        {!weapons[0] ? (
          <li className='list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between'>
            No Weapons Registered
            <a href='/weapons/register' className='btn btn-primary'>
              Register a Weapon
            </a>
          </li>
        ) : (
          <>
            <button
              className='btn btn-secondary mt-2'
              type='button'
              data-toggle='collapse'
              data-target='#registeredWeapons'
              aria-expanded='false'
              aria-controls='collapseExample'>
              Toggle Registered Weapons
            </button>
            <div className='collapse mt-2' id='registeredWeapons'>
              {weapons.map((weapon, index) => (
                <li
                  key={index}
                  className='list-group-item d-flex justify-content-between bg-secondary border-dark'>
                  <div key={index}>
                    {/* Vehicle */}
                    <span className='font-weight-bold'>{weapon.weapon}</span>
                    <br />
                    {/* Serial Number */}
                    <span className='font-weight-bold'>Serial Number: </span>
                    <span className='uppercase font-weight-normal'>
                      {weapon.serial_number}
                    </span>
                    <br />
                    {/* Status */}
                    <span className='font-weight-bold'>Weapon Status:</span>
                    <span> {weapon.status}</span> <br />
                  </div>

                  {/* actions */}
                  <div className=''>
                    <a
                      href='#deleteWeapon'
                      onClick={() => this.deleteWeapon(weapon.id)}
                      className='btn btn-danger ml-2'>
                      Delete
                    </a>
                  </div>
                </li>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
