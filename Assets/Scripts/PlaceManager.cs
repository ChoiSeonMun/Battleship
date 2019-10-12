using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 배치 단계에서 일어나는 일들을 담당합니다.
/// </summary>
public class PlaceManager : MonoBehaviour
{
    public static PlaceManager instance;

    Ship.EShip eShip;
    GameObject shipObj;
    GameObject shipInst;
    bool hasPlaced = false;
    Hex placingHex;
    bool isDragging = false;
    Hex.EDirec eDirec;

    Hex chosenHex;
    Ship.EShip chosenEShip;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    void Update()
    {
        if (Input.GetMouseButtonUp(0))
        {
            if (isDragging)
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
            Hex mouseToHex = Hex.MouseToHex();
            if (mouseToHex != null && mouseToHex.Equals(placingHex))
                BeginDrag();
            else
                Debug.Log($"{Hex.MouseToHex()} vs {placingHex}");
        }

        if (isDragging)
            Drag();
    }

    public void ChooseShip(Ship.EShip eShip, GameObject ship)
    {
        Debug.Log($"Choose ship: {ship.name}");
        this.eShip = eShip;
        shipObj = ship;
        hasPlaced = false;
        isDragging = false;
    }

    /// <summary>함선을 배치할 타일을 선택합니다.</summary>
    void BeginPlacing()
    {
        placingHex = Hex.MouseToHex();
        if (placingHex != null)
        {
            Debug.Log("Begin Placing");
            hasPlaced = true;
        }
        else
        {
            hasPlaced = false;
        }
    }
    void BeginDrag()
    {
        Debug.Log("Begin Drag");
        isDragging = true;
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
        if (MapManager.instance.CanPlace(eShip, placingHex, eDirec))
            SuccessDrag();
        else
            FailDrag();
    }
    void SuccessDrag()
    {
        Debug.Log("Success Drag");
        hasPlaced = false;
        UIManager.instance.PlaceUnhighlight();
        isDragging = false;
        shipInst = null;
        if (!MapManager.instance.Place(eShip, placingHex, eDirec))
        {
            shipObj = null;
        }
    }
    void FailDrag()
    {
        hasPlaced = false;
        UIManager.instance.PlaceUnhighlight();
        isDragging = false;
        Destroy(shipInst);
        shipInst = null;
    }

    /// <summary>해당 타일의 함선을 선택합니다.</summary>
    public void SelectShip(Hex hex, Ship.EShip eShip)
    {
        chosenHex = new Hex(hex);
        chosenEShip = eShip;
        UIManager.instance.DisplayPlacementButtons(true);
    }
    public void DeselectShip()
    {
        if (chosenHex == null)
            return;

        chosenHex = null;
        chosenEShip = Ship.EShip.NONE;
        UIManager.instance.DisplayPlacementButtons(false);
    }
}
