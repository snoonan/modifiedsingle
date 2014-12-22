from google.appengine.ext import ndb

#
# One row per match. Each match has two players, a winner and a loser.
# The match takes place at a club, in a tourney.
#

import clubs
import players

class Match(ndb.Model):
    """Models a match between two players."""
    date = ndb.DateTimeProperty()
    matchid = ndb.IntegerProperty()
    club = ndb.KeyProperty(kind=clubs.Club)

    playerW = ndb.KeyProperty(kind=players.Player)
    handicapW = ndb.StringProperty()
    scoreW = ndb.IntegerProperty()
    targetW = ndb.IntegerProperty()

    playerL = ndb.KeyProperty(kind=players.Player)
    handicapL = ndb.StringProperty()
    scoreL = ndb.IntegerProperty()
    targetL = ndb.IntegerProperty()

