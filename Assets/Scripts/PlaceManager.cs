using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 배치 단계에서 일어나는 일들을 담당합니다.
/// </summary>
public class PlaceManager : MonoBehaviour
{
    public static PlaceManager instance;

    public Ship.EShip PlacingEShip { get; private set; }
    GameObject shipObj;
    GameObject shipInst;
    bool hasPlaced = false;
    Hex placingHex;
    public bool IsDragging { get; private set; } = false;
    Hex.EDirec eDirec;

    Hex chosenHex;
    public Ship.EShip ChosenEShip { get; private set; }

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    void Update()
    {
        if (Input.GetMouseButtonUp(0))
        {
            if (IsDragging)
            {
                Hex mouseToHex = Hex.MouseToHex();
                if (mouseToHex != null && mouseToHex.Equals(placingHex))
                    FailDrag();
                else
                    FinishDrag();
                return;
            }
            else
            {
                if (shipObj != null)
                {
                    BeginPlacing();
                    return;
                }
            }
        }

        if (!hasPlaced) return;

        if (Input.GetMouseButtonDown(0))
        {
            Hex hex = Hex.MouseToHex();
            if (hex != null && hex.Equals(placingHex) && MapManager.instance.Ships[hex.y, hex.x] == Ship.EShip.NONE)
                BeginDrag();
        }

        if (IsDragging)
            Drag();
    }

    public void ChooseShip(Ship.EShip eShip, GameObject ship)
    {
        Debug.Log($"Choose ship: {ship.name}");
        this.PlacingEShip = eShip;
        shipObj = ship;
        hasPlaced = false;
        IsDragging = false;
        UIManager.instance.UpdateShipIcons(eShip);
    }
    public void UnchooseShip()
    {
        Debug.Log("Unchoose ship");
        PlacingEShip = Ship.EShip.NONE;
        shipObj = null;
        hasPlaced = false;
        IsDragging = false;
        UIManager.instance.UpdateShipIcons(PlacingEShip);
    }

    /// <summary>함선을 배치할 타일을 선택합니다.</summary>
    void BeginPlacing()
    {
        placingHex = Hex.MouseToHex();
        if (placingHex != null)
        {
            Debug.Log("Begin Placing");
            hasPlaced = true;
            UIManager.instance.PlaceHighlight(placingHex);
        }
        else
        {
            hasPlaced = false;
            UIManager.instance.PlaceUnhighlight();
        }
    }
    void BeginDrag()
    {
        Debug.Log("Begin Drag");
        IsDragging = true;
        shipInst = Instantiate(shipObj, Hex.HexToSqr(placingHex), Quaternion.identity, null);
    }
    void Drag()
    {
        Vector2 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector2 direction = ((Vector2)shipInst.transform.position - mousePos).normalized;
        shipInst.transform.right = Hex.SnapAngle(direction, out eDirec);
    }
    void FinishDrag()
    {
        if (MapManager.instance.CanPlace(PlacingEShip, placingHex, eDirec))
            SuccessDrag();
        else
            FailDrag();
    }
    void SuccessDrag()
    {
        Debug.Log("Success Drag");
        hasPlaced = false;
        UIManager.instance.PlaceUnhighlight();
        IsDragging = false;
        shipInst = null;
        if (!MapManager.instance.Place(PlacingEShip, placingHex, eDirec))
        {
            UnchooseShip();
        }
    }
    void FailDrag()
    {
        hasPlaced = false;
        UIManager.instance.PlaceUnhighlight();
        IsDragging = false;
        Destroy(shipInst);
        shipInst = null;
    }

    /// <summary>해당 타일의 함선을 선택합니다.</summary>
    public void SelectShip(Hex hex, Ship.EShip eShip)
    {
        chosenHex = new Hex(hex);
        ChosenEShip = eShip;
        UIManager.instance.DisplayPlacementButtons(true);
    }
    public void DeselectShip()
    {
        if (chosenHex == null)
            return;

        chosenHex = null;
        ChosenEShip = Ship.EShip.NONE;
        UIManager.instance.DisplayPlacementButtons(false);
    }
}
