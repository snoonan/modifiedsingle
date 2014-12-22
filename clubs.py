from google.appengine.ext import ndb

#
#


class Club(ndb.Model):
    """Models a club."""
    name = ndb.StringProperty()

