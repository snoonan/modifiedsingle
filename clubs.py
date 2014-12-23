from google.appengine.ext import ndb

#
#


class Club(ndb.Model):
    """Models a club."""
    name = ndb.StringProperty()
    owners = ndb.UserProperty(repeated=True)
    invited = ndb.StringProperty(repeated=True)

