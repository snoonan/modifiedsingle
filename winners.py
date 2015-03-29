from google.appengine.ext import ndb

#
# One row per match. Each match has two players, a winner and a loser.
# The match takes place at a club, in a tourney.
#

import clubs
import tourneys
import players

class Winner(ndb.Model):
    """Tournement winners."""

    club = ndb.KeyProperty(kind=clubs.Club)
    tourney = ndb.KeyProperty(kind=tourneys.Tourney)
    player = ndb.KeyProperty(kind=players.Player)
    handicap = ndb.StringProperty()

    place = ndb.StringProperty()      # S = semi final F=Final W=Winner
