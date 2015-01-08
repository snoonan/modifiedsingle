from google.appengine.ext import ndb

#
#

import handicap

class Club(ndb.Model):
    """Models a club."""
    name = ndb.StringProperty()
    owners = ndb.UserProperty(repeated=True)
    invited = ndb.StringProperty(repeated=True)
    deflfold = ndb.IntegerProperty(default=2)
    defwfold = ndb.IntegerProperty(default=3)

