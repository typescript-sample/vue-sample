<template>
      
        <header class='border-bottom-highlight'>

          <div class='cover-image' v-if="locationProps.thumbnail">
            <img alt='' :src='"data:image/jpeg;base64,"+locationProps.thumbnail' />
            <div class='contact-group'>
                    <button id='btnPhone' name='btnPhone' class='btn-phone' />
                    <button id='btnEmail' name='btnEmail' class='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' class='btn-follow'>Follow</button>
          </div>

          <div class='cover-image' v-else>
                <img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />
                <div class='contact-group'>
                    <button id='btnPhone' name='btnPhone' class='btn-phone' />
                    <button id='btnEmail' name='btnEmail' class='btn-email' />
                </div>
                <button id='btnFollow' name='btnFollow' class='btn-follow'>Follow</button>
          </div>

          <button id='btnCamera' name='btnCamera' class='btn-camera' />
          <div class='avatar-wrapper'>
            <img alt='' class='avatar' v-if="locationProps.imageURL" :src="locationProps.imageURL"/>
            <img alt='' class='avatar' v-else src='https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png' />
            <!-- <img class='profile-status' alt='status' src=imageOnline /> -->
          </div>
          <div class='profile-title'>
            <h3>{{locationProps.name}}</h3>
            <p>{{locationProps.description}}</p>
            <p>500 followers</p>
          </div>
        
          <nav class="menu">
          <ul >
            <li>
                 <router-link :to="{ name: 'home'}" >Home</router-link>
            </li>
            <li><a href="#"> Bookable </a></li>
            <li  >
                <router-link :to="{ name: 'review'}" >Review</router-link>
            </li>
            <li><a href="#"> Photo </a></li>
            <li><a href="#"> About </a></li>
          </ul>
        </nav>
        </header>
       <!-- <router-view /> -->
      
  
</template>

<script lang="ts">

import { Options } from "vue-class-component";
import {  EditComponent } from "vuex-one";
import { Location } from "../service/location";


@Options({
    props: [
        'locationProps'
    ]
})
export default class LocationPage extends EditComponent<Location, string>{


}
</script>