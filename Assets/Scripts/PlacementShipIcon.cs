using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class PlacementShipIcon : MonoBehaviour
{
    public Ship.EShip eShip;
    [Header("Ship Prefab")]
    public GameObject ship;

    public void ChooseShip()
    {
        if (MapManager.instance.ShipCounts[(int)eShip] > 0)
        {
            if (PlaceManager.instance.PlacingEShip == eShip)
            {
                PlaceManager.instance.UnchooseShip();
                return;
            }

            PlaceManager.instance.ChooseShip(eShip, ship);
        }
        else
        {
            Debug.Log($"{eShip}: 더 이상 배치할 수 없습니다.");
            PlaceManager.instance.UnchooseShip();
        }
    }
}
