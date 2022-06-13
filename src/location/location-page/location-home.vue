<template>
  

  <div class="profile view-container">
    <form id="locationForm" name="locationForm">
      
      <Menu :locationProps="location" />
      {{ markerOptions() }}
      <div class='wrapper'>
            <ejs-maps :zoomSettings='zoomSettings' >
                <e-layers>
                    <e-layer :layerType='layerType' >
                    </e-layer>
                </e-layers>
        </ejs-maps>
      </div>
      <!-- <GMapMap
                :center="center"
                :zoom="5"
                map-type-id="terrain"
                style="width: 100%; height: 500px"
            >
                <GMapCluster v-if="location">
                <GMapMarker
                    :key="index"
                    v-for="(item, index) in markers"
                    :position='item.position'
                    :clickable="true"
                    :draggable="true"
                    @click='center=item.position'
                />
                </GMapCluster>
            </GMapMap> -->
      <!-- <ejs-maps id='maps'></ejs-maps> -->
      <!-- <GoogleMap api-key="AIzaSyD07GxVWJhjALJsdlwPbDpvVpUiyG3b3IA" style="width: 100%; height: 500px" :center="center" :zoom="15">
            <Marker :options="{ position: center}" />
            </GoogleMap> -->
    </form>
  </div>
  
</template>

<script lang="ts">
import {
  inputEdit,
} from "uione";
import { Options } from "vue-class-component";
import { buildId, EditComponent } from "vuex-one";
import { Location, LocationClient } from "../service/location";
import {  getLocations  } from "../service";
import Menu from "./index.vue";
import { MapsPlugin, MapsComponent, Zoom } from '@syncfusion/ej2-vue-maps';

// import { MapsComponent, MapsPlugin } from '@syncfusion/ej2-vue-maps';
import { GoogleMap, Marker } from "vue3-google-map";


@Options({
    components: {
        Menu,
        // MapsComponent,
        // MapsPlugin
        GoogleMap,
        Marker,
        MapsPlugin, 
        MapsComponent
    }
})
export default class Review extends EditComponent<Location, string>{

    // mapObj:any = null;
    // L: any = null;
    // defaultCoord:any = [10.7743, 106.6669]; // coord mặc định, 9 giữa HCMC
    // zoomLevel:any = 13;
	// mapConfig:any = {
	// 	attributionControl: false, // để ko hiện watermark nữa, nếu bị liên hệ đòi thì nhớ open nha
	// 	center: this.defaultCoord, // vị trí map mặc định hiện tại
	// 	zoom: this.zoomLevel, // level zoom
	// };
    layerType:any = 'OSM';
     zoomSettings:any = {
           enable: true,
           toolBars: ["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]
       };
   
    location: Location = {} as any;
    latitude: number = 10;
    longitude: number = 106;
    service:  LocationClient = {} as any;
    // center: object = { 
    //     lat: this.latitude, 
    //     lng: this.longitude
    // };
    center = { lat: this.latitude, lng: this.longitude }
    markers: any = [
    {
        position: {
        lat: this.latitude, 
        lng: this.longitude
        },
    }
    , // Along list of clusters
    ];
   
    beforeCreate(){
        const id = buildId<string>(this.$route) ;
        Promise.all([
        ])
        .then(() => {
            if (id) {
                this.load(id);
                // this.loadData(id);
            }
            
        })
        .catch(this.handleError);
        // let recaptchaScript = this.L;
        // recaptchaScript = document.createElement('script');
        // recaptchaScript.setAttribute('src', 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js');
        // recaptchaScript.setAttribute('integrity', 'sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg==');
        // recaptchaScript.setAttribute('crossorigin', "");
        // document.head.appendChild(recaptchaScript);
        // let link = document.createElement('link');
        // link.setAttribute('rel', 'stylesheet');
        // link.setAttribute('href', 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css');
        // link.setAttribute('integrity', 'sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==');
        // link.setAttribute('crossorigin', "");
        // document.head.appendChild(link);
        
    }

    created() {
        this.onCreated(getLocations(), inputEdit());
    
        
		// this.mapObj = L.map('sethPhatMap', this.mapConfig);
		
        // console.log('map:::',this.mapObj);
		
		// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// 	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		// }).addTo(this.mapObj);
		
		
		// var popupOption = {
		//   	className: "map-popup-content",
		// };
		// var marker = this.addMarker([10.7743, 106.6669], `<div class='left'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SGNN50inDZcOweium4llf4qacFBFgBK9sXW7fxQ_lBm6-Abcww' /></div><div class='right'><b>Đây có gì hot?</b><br>Một Popup có 1 cô gái tên là Lailah</div><div class='clearfix'></div>`, popupOption);
         

    }

    mounted(){
        // this.form = initForm(this.$refs.form as any, registerEvents);
        // <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==" crossorigin=""/>
        
        
    }


    showModel(obj: Location) 
    {
       
        this.location = obj;
        this.latitude =  this.location?.latitude
        this.longitude = this.location?.longitude     
    }

    // addMarker(coord: any, popupContent: any, popupOptionObj: any, markerObj?: any) {
	// 	if (!popupOptionObj) {
	// 		popupOptionObj = {};
	// 	}
	// 	if (!markerObj) {
	// 		markerObj = {};
	// 	}
		
	// 	var marker =L.marker(coord, markerObj).addTo(this.mapObj); 
	// 	var popup = L.popup(popupOptionObj);
	// 	popup.setContent(popupContent);
		
	// 	// binding
	// 	marker.bindPopup(popup);
		
	// 	return marker;
	// }

    markerOptions()
    {
        // if(this.location?.latitude && this.location?.longitude)
        // {
        //     this.latitude = this.location.longitude;
        //     this.longitude = this.location.latitude;
            
        //     this.center = { lat: this.latitude, lng: this.longitude };
        //     console.log('avdsadf', this.latitude, this.longitude, this.center);
        // }
    }
    
}
</script>

<style scoped>
.wrapper {
    width: 2000px;
    max-width: 100%;
    margin: 0 auto;
  }
</style>