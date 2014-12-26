from google.appengine.ext import ndb

#
# One row per tourney
#

import clubs

class Tourney(ndb.Model):
    """Models a tourney."""

    slug = ndb.StringProperty()
    name = ndb.StringProperty()
    date = ndb.DateProperty()
    size = ndb.IntegerProperty()
    club = ndb.KeyProperty(kind=clubs.Club)
