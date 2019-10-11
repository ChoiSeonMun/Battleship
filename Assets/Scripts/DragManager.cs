using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DragManager : MonoBehaviour
{
    public static DragManager instance;

    public bool IsDragging { get; private set; } = false;
    [System.NonSerialized]
    public Ship.EShip eShip;
    [System.NonSerialized]
    public GameObject DraggingObject;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    void Update()
    {
        if (IsDragging)
        {
            DraggingObject.transform.position = (Vector2)Camera.main.ScreenToWorldPoint(Input.mousePosition);
        }
    }

    public void BeginDrag(Ship.EShip eShip, GameObject obj)
    {
        IsDragging = true;
        this.eShip = eShip;
        DraggingObject = obj;
    }
    public void EndDrag()
    {
        Debug.Log($"DragManager.Enddrag: {DraggingObject}");

        //TODO: 함선 배치
        Vector2 pos = DraggingObject.transform.position;

        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit2D hit = Physics2D.GetRayIntersection(ray, Mathf.Infinity);

        if (hit.collider != null)
        {
            GameObject obj = hit.collider.gameObject;
            Hex hex = Hex.SqrToHex(obj.transform.position);
            DraggingObject.transform.position = Hex.HexToSqr(hex);
        }
        else
        {
            Debug.Log($"Cannot place {DraggingObject.name}");
            Destroy(DraggingObject);
            MapManager.instance.IncreaseShipCount(eShip);
        }

        IsDragging = false;
        //DraggingObject = null;
    }
}
