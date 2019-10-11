using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class PlacementShipIcon : MonoBehaviour
{
    public Ship.EShip eShip;
    [Header("Ship Prefab")]
    public GameObject ship;

    public void BeginDrag()
    {
        if (MapManager.instance.ShipCounts[(int)eShip] > 0)
        {
            MapManager.instance.DecreaseShipCount(eShip);

            Vector3 pos = Camera.main.ScreenToWorldPoint(transform.position);
            pos.z = 0f;
            GameObject shipInst = Instantiate(ship, pos, Quaternion.identity, null);
            DragManager.instance.BeginDrag(eShip, shipInst);
        }
        else
        {
            Debug.Log($"Cannot drag {ship.name}: ShipCount is 0");
        }

        
    }
}
