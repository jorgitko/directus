define([
  'app',
  'backbone',
  'core/widgets/widgets',
  'moment'
],

function(app, Backbone, Widgets, moment) {

  var FilesCardView = Backbone.Layout.extend({

    // <div class="file-listing" id="file-listing">
    tagName: 'div',

    attributes: {
      class: 'file-listing',
      id: 'file-listing'
    },

    events: {
      'click .js-file': function(event) {
        var id = $(event.currentTarget).data('id');

        app.router.go('#files', id);
      }
    },

    template: 'modules/files/card-view',

    serialize: function() {
      var rows = this.collection.map(function (model) {
        var statusValue = model.getStatusColumnName();//model.get(app.statusMapping.status_name);
        var title = model.get('title') || '';
        var data = {
          id: model.get('id'),
          inactive: (statusValue !== model.table.getStatusDefaultValue()), //app.statusMapping.active_num),
          cid: model.cid,
          title: title,
          title_short: (title.length > 35)? title.substr(0,32) + "..." : title,
          date_uploaded: model.get('date_uploaded'),
          size: model.get('size'),
          type: (model.has('type')) ? model.get('type').split('/').pop() : '',
          dimensions: model.get('width') + "×" + model.get('height')
        };

        var type = model.get('type').substring(0, model.get('type').indexOf('/'));
        var subtype = model.get('type').split('/').pop();

        if (data.id && (type == 'image' || type === 'embed' || subtype === 'pdf') && model.makeFileUrl(true)) {
          data.thumbnailUrl = model.makeFileUrl(true);
        }

        if(!model.get('width') || !model.get('height')){
          data.dimensions = "";
        }

        if(type === "embed") {
          data.size = app.seconds_convert(data.size);
          data.dimensions = "";
          data.embed = true;
        } else {
          data.size = app.bytesToSize(data.size, 0);
          data.embed = false;
        }

        return data;
      });
      return {rows: rows};
    },

    afterRender: function() {
      // Show fallback image if file missing
      $('.header-image > img', this.$el).error(function() {
        $(this).off('error');
        $(this).attr('src', app.root + 'assets/img/missing-image-placeholder.jpg');
      });
    },

    initialize: function(options) {
      this.collection.setOrder('date_uploaded', 'DESC');
      this.collection.on('sort', this.render, this);
      this.collection.on('sync', this.render, this);
    }

  });

  return FilesCardView;

});
