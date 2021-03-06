from google.appengine.ext import ndb

#
# One row per player, regardless of how many seasons they play
#

import clubs

class Player(ndb.Model):
    """Models a player."""
    name = ndb.StringProperty()
    firstName = ndb.StringProperty()
    lastName = ndb.StringProperty()
    club = ndb.KeyProperty(kind=clubs.Club)
    handicap = ndb.StringProperty()


    @classmethod
    def getPlayers(self):
        ret_list = []
        for item in self.query().order(Player.firstName, Player.lastName):
            my_dict = item.to_dict()
            my_dict['id'] = item.key.id()
            ret_list.append(my_dict)
        return ret_list
