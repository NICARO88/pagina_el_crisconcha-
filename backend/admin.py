from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask import request, url_for, redirect
from flask_login import current_user
from flask_admin.menu import MenuLink

class AuthMixin:
    def is_accessible(self):
        # New: Uses Flask-Login's current_user
        return current_user.is_authenticated and getattr(current_user, "is_admin", False)
    
    def inaccessible_callback(self, name, **kwargs):
        # Changed: Redirects to login instead of auth
        return redirect(url_for("admin_login", next=request.url))

class SecureModelView(AuthMixin, ModelView):
    can_export = True
    page_size = 50
    can_view_details = True
    create_modal = True
    edit_modal = True

class SecureAdminIndex(AuthMixin, AdminIndexView):
    pass

def init_admin(app, db, models):
    admin = Admin(app, name="CRISCONCHA Admin",
                  index_view=SecureAdminIndex(),
                  template_mode="bootstrap4")
    admin.add_link(MenuLink(name="Cerrar sesión", category="", url="/admin/logout"))
    class LeadAdmin(SecureModelView):
        column_searchable_list = ('name','email','location','event_type')
        column_filters = ('marketing_opt_in','created_at','year','month','day')
        column_default_sort = ('created_at', True)
        column_list = ('id','created_at','name','email','date_fmt','location','attendees','duration','marketing_opt_in')
        column_labels = dict(date_fmt='Fecha evento', marketing_opt_in='Acepta promos')
        def _date_fmt(view, context, model, name):
            return f"{model.day:02d}/{model.month:02d}/{model.year}"
        column_formatters = dict(date_fmt=_date_fmt)
    class EventAdmin(SecureModelView):
        column_searchable_list = ('location','note')
        column_filters = ('date','is_published')
        column_default_sort = ('date', False)
        column_list = ('id','date','location','note','is_published')
        
    admin.add_view(EventAdmin(models.Event, db.session, category="Contenido"))
    admin.add_view(LeadAdmin(models.Lead, db.session, category="Leads"))