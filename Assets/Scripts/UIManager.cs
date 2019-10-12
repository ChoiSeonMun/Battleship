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
    private Text battleshipCountText = null;
    [SerializeField]
    private Text cruiserCountText = null;
    [SerializeField]
    private Text destroyerCountText = null;
    [SerializeField]
    private GameObject PlacementButtons = null;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    void Start()
    {
        PlacementButtons.SetActive(false);
    }

    #region PLACEMENT PHASE
    public void UpdatePlacementPhase()
    {
        // TODO: Text 필드 전부 지우고 transform.GetComponentInChildren<Text>()으로 찾아서 소프트코딩
        battleshipCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.BATTLESHIP].ToString();
        cruiserCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.CRUISER].ToString();
        destroyerCountText.text = MapManager.instance.ShipCounts[(int)Ship.EShip.DESTROYER].ToString();
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
