using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    static public UIManager instance;

    [Header("◆ Instances")]
    [SerializeField]
    private GameObject placeHighlighter = null;
    [SerializeField]
    private GameObject selectHighlighter = null;
    [SerializeField]
    private GameObject attackHighlighter = null;
    [SerializeField]
    private GameObject shipCountIndicators = null;
    [SerializeField]
    private GameObject PlacementButtons = null;

    Image[] shipIcons;
    Text[] shipCountTexts;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);

        shipIcons = shipCountIndicators.transform.GetComponentsInChildren<Image>();
        shipCountTexts = shipCountIndicators.transform.GetComponentsInChildren<Text>();
    }
    void Start()
    {
        PlacementButtons.SetActive(false);
    }

    #region PLACEMENT PHASE
    public void UpdateShipIcons(Ship.EShip eShip)
    {
        Color newColor;
        foreach (Image shipIcon in shipIcons)
        {
            newColor = shipIcon.color;
            newColor.a = 0.5f;
            shipIcon.color = newColor;
        }

        if (eShip == Ship.EShip.NONE)
            return;

        Debug.Log(eShip);
        Image icon = shipIcons[(int)eShip - 1];
        newColor = icon.color;
        newColor.a = 1f;
        icon.color = newColor;
    }
    public void UpdateShipCountTexts()
    {
        int idx = 1;
        foreach (Text shipCountText in shipCountTexts)
        {
            shipCountText.text = MapManager.instance.ShipCounts[idx++].ToString();
        }
        //battleshipCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.BATTLESHIP].ToString();
        //cruiserCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.CRUISER].ToString();
        //destroyerCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.DESTROYER].ToString();
    }
    public void DisplayPlacementButtons(bool on)
    {
        PlacementButtons.SetActive(on);
        if (!on)
            PlaceUnhighlight();
    }
    #endregion

    #region HIGHLIGHTING
    public void PlaceHighlight(Hex hex)
    {
        UnhighlightAll();
        placeHighlighter.SetActive(true);
        placeHighlighter.transform.position = Hex.HexToSqr(hex);
    }
    public void SelectHighlight(Hex hex)
    {
        UnhighlightAll();
        selectHighlighter.SetActive(true);
        selectHighlighter.transform.position = Hex.HexToSqr(hex);
    }
    public void AttackHighlight(Hex hex)
    {
        UnhighlightAll();
        attackHighlighter.SetActive(true);
        attackHighlighter.transform.position = Hex.HexToSqr(hex);
    }
    public void PlaceUnhighlight()
    {
        placeHighlighter.SetActive(false);
    }
    public void SelectUnhighlight()
    {
        selectHighlighter.SetActive(false);
    }
    public void AttackUnhighlight()
    {
        attackHighlighter.SetActive(false);
    }
    public void UnhighlightAll()
    {
        PlaceUnhighlight();
        SelectUnhighlight();
        AttackUnhighlight();
    }
    #endregion
}
