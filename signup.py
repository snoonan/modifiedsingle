from google.appengine.ext import ndb

#
# One row per player, regardless of how many seasons they play
#

import players
import tourneys

class Signup(ndb.Model):
    tournement = ndb.KeyProperty(kind=tourneys.Tourney)
    player = ndb.KeyProperty(kind=players.Player)
    paid = ndb.BooleanProperty(default=False)
