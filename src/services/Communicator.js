import $ from 'jquery';
import configs from '../configs.json';

function fetchUserData(user){
  var requestPlayerById = function(resolve, reject, id){
    $.get(`${configs.OGS_API_ROOT}${id}`)
    .done(function(res){
      resolve(res);

    }.bind(this))
    .fail(function(err){
      reject(`Error connecting to OGS server. <strong>Error code: ${err.status}</strong>. Please try again later or contact me if you really have the need to stalk that person.`);
    });
  }.bind(this);


  return new Promise((resolve, reject) => {
    if(isNaN(user)){ // Entered username
      $.get(`${configs.OGS_API_ROOT}?username=${user}`)
      .done(function(res){
        if(res.results.length > 0){
          requestPlayerById(resolve, reject, res.results[0].id);
        }
        else{
          reject("Error: user not found. Are you sure you entered the correct username? If it still doesn't work, try using user id instead.");
        }
      }.bind(this))
      .fail(function(err){
        reject(`Error connecting to OGS server. <strong>Error code: ${err.status}</strong>. Please try again later or contact me if you really have the need to stalk that person.`);
      });
    }
    else{  // Entered user id
      requestPlayerById(resolve, reject, user);
    }
  });
}


function getAllGames(callBack, playerId, url){
  if(url === undefined) url = `${configs.OGS_API_ROOT}${playerId}/games/?ended__isnull=false&annulled=false&ordering=-ended&page_size=50`;

  var localData;
  try{
    localData = JSON.parse(localStorage.getItem('ogsUserData_'+$scope.statistics.player.id));
  }
  catch(e){
    localData = undefined;
  }

  // TODO return localData
  // if(!localData){
  //   $rootScope.userDataSaved = false;
  // }
  // else{
  //   $rootScope.userDataSaved = true;
  // }


  $.get(url).
  done(function(successData){
    if($scope.destroyed) return;

    $scope.connectionError = false;
    $scope.retryNumber = 0;
    $scope.loadingPage++;
    $scope.totalPages = Math.ceil(successData.data.count/50);

    var completedWithLocalStorage = false;

    if(!localData){
      $scope.statistics.allGames = $scope.statistics.allGames.concat(successData.data.results);
    }
    else{
      for(var i=0;i<successData.data.results.length;i++){
        if(successData.data.results[i].id == localData[0].id){
          $scope.statistics.allGames = $scope.statistics.allGames.concat(localData);
          completedWithLocalStorage = true;
          break;
        }
        else{
          $scope.statistics.allGames.push(successData.data.results[i]);
        }
      }
    }

    if(!completedWithLocalStorage && successData.data.next != null)
      getAllGames(callBack, successData.data.next.replace("http://", "https://"));
    else{
      // Finishes querying
      if(!!localData) saveUserData();
      $scope.statistics.analyzingGames = $scope.statistics.allGames;
      callBack();
    }
  })
  .fail(function(errorData){
    if($scope.destroyed) return;

    // If you can't get what this part mean, it means I don't know shit about Angularjs
    $scope.connectionError = true;
    $scope.retryNumber+=1;

    if($scope.retryNumber < 5){
        $scope.connectionErrorMessage = "Error connecting to OGS server. <strong>Error code: " + errorData.status + "</strong>. Retrying in "+(retryNumber*retryNumber)+" seconds...";
        setTimeout(function(){getAllGames(callBack, url);}, $scope.retryNumber*$scope.retryNumber*1000);
    }
    else{
      $scope.connectionErrorMessage = "Error connecting to OGS server. <strong>Error code: " + errorData.status + "</strong>. Please try again later or contact me if you really have the need to stalk that person.";
    }
  });
};

export default { fetchUserData };
