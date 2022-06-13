<template>
  <div class="view-container">
    <form id="locationForm" name="locationForm" ref="form">
      <header>
        <button type="button" class="btn-back" @click="back(event)"></button>
        <h2>
          {{ newMode ? resource.button_create : resource.button_edit }}
          <!-- {{ resource.item }} -->
          Location
        </h2>
      </header>
      <div class="row">
        <label class="col s12 m6">
          <!-- {{ resource.item_id }} -->
          Name
          <input
            type="text"
            id="name"
            name="name"
            v-model="location.name"
            @change="updateState"
            maxlength="20"
            :required="true"
            placeholder="Name"
          />
        </label>
        <label className='col s12 m6'>
            Type
            <input
              type='text'
              id='type'
              name='type'
              v-model="location.type"
              @change="updateState"
              maxlength="20"
              :required="true"
              placeholder='Type' />
        </label>
        <label className='col s12 m6'>
            Longitude
            <input
                type='text'
                id='longitude'
                name='longitude'
                v-model="location.longitude"
                readOnly
                @change="updateState"
                maxlength="40"
               :required="true"
                placeholder='Longitude' />
        </label>
        <label className='col s12 m6'>
            Latitude
            <input
                type='text'
                id='latitude'
                name='latitude'
                v-model="location.latitude"
                readOnly
                @change="updateState"
                maxlength="40"
                :required="true"
                placeholder='Latitude' />
        </label>
        <label className='col s12 m6'>
            Description
            <input
                type='text'
                id='description'
                name='description'
                v-model="location.description"
                @change="updateState"
                maxlength="40"
                :required="true"
                placeholder='Description' />
        </label>
        <label className='col s12 m6'>
            ImageURL
            <input
              type='text'
              id='imageURL'
              name='imageURL'
              v-model="location.imageURL"
              @change="updateState"
              :required="true"
              placeholder='ImageURL' />
        </label>
        <!-- <div className='col s12 m6 radio-section'>
            {{resource.status}}
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  id='active'
                  name='status'
                  @change="updateState"
                  v-model="Status.Active"
                  :checked="location.status === Status.Active" />
               {{  resource.yes }}}
              </label>
              <label>
                <input
                  type='radio'
                  id='inactive'
                  name='status'
                  @change="updateState"
                  v-model="Status.Inactive"
                  :checked="location.status === Status.Inactive" />
               {{  resource.no }}}
              </label>
            </div>
          </div> -->
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>
<script lang="ts">
import {
  initForm,
  inputEdit,
  registerEvents,
  Status
} from "uione";
import { Options } from "vue-class-component";
import { buildId, createModel, EditComponent } from "vuex-one";
import {  getLocations } from "./service";
import { Location } from "./service";

@Options({})
export default class LocationComponent extends EditComponent<Location, string> {
  
  location: Location = {} as any;
  created() {
    this.onCreated(getLocations(), inputEdit());
  }

  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const id = buildId<string>(this.$route);
    Promise.all([
    ])
      .then((values) => {
        if (id) {
          this.load(id);
        }
      })
      .catch(this.handleError);
  }

  createModel(): Location {
    const location = createModel<Location>(this.metadata);
    return location;
  }
  showModel(obj: Location) {
    this.location = obj;
  }
}
</script>
