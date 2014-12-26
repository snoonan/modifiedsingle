from google.appengine.ext import ndb

#
# One row per match. Each match has two players, a winner and a loser.
# The match takes place at a club, in a tourney.
#

import clubs
import tourneys
import players

class Match(ndb.Model):
    """Models a match between two players."""

    matchid = ndb.IntegerProperty()
    club = ndb.KeyProperty(kind=clubs.Club)
    tourney = ndb.KeyProperty(kind=tourneys.Tourney)

    playerA = ndb.KeyProperty(kind=players.Player)
    handicapA = ndb.StringProperty()
    scoreA = ndb.IntegerProperty()
    targetA = ndb.IntegerProperty()

    playerB = ndb.KeyProperty(kind=players.Player)
    handicapB = ndb.StringProperty()
    scoreB = ndb.IntegerProperty()
    targetB = ndb.IntegerProperty()

    winner = ndb.IntegerProperty(default = 0)



