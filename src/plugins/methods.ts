import { User } from '../classes/user';
import { Schema } from 'mongoose';

export function crudMethods(schema:Schema){
  schema.methods.createStatus = function(createdBy:User) {
    this.$set('status.createdBy', createdBy._id);
    this.$set('status.createdAt', new Date());
    this.save();
  };

  schema.methods.updateStatus = function(updatedBy:User) {
    this.$set('status.updatedBy', updatedBy._id);
    this.$set('status.updatedAt', new Date());
    this.save();
  };

  schema.methods.deleteStatus = function (deletedBy:User) {
    this.$set('status.deletedBy', deletedBy._id);
    this.$set('status.deletedAt', new Date());
    this.save();
  };

  schema.methods.activateStatus = function (deactivatedBy:User) {
    this.$set('status.deactivatedBy', deactivatedBy._id);
    this.save();
  };

  schema.methods.createStatus = function() {
    this.$set('status.createdAt', new Date());
    this.save();
  };

  schema.methods.updateStatus = function() {
    this.$set('status.updatedAt', new Date());
    this.save();
  };

  schema.methods.deleteStatus = function () {
    this.$set('status.deletedAt', new Date());
    this.save();
  };
}