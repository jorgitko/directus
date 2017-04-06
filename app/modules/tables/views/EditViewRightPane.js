define([
  'app',
  'core/RightPane',
  'core/widgets/timeline/TimelineWidget',
  'core/widgets/MetadataWidget',
  'core/widgets/StatusWidget'
], function(app, RightPane, TimelineWidget, MetadataWidget, StatusWidget) {

  return RightPane.extend({

    attributes: {
      class: 'scroll-y wide no-title'
    },

    beforeRender: function() {
      var table = this.model.table;
      var statusColumnName = table ? table.getStatusColumnName() : app.statusMapping.get('*').get('status_name');

      this.baseView.rightSidebarView.$el.addClass('scroll-y wide no-title');

      if (this.model.has(statusColumnName)) {
        this.insertView(new StatusWidget({model: this.model}));
      }

      this.insertView(new MetadataWidget.View({
        model: new MetadataWidget.Model({}, {
          table: this.model.table,
          recordId: this.model.id
        }),
        itemModel: this.model
      }));
      this.insertView(new TimelineWidget({model: this.model}));
    }
  });
});
